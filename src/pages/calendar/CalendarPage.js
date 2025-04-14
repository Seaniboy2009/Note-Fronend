import React, { useEffect, useState } from "react";
import style from "../../styles/Calendar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useUser } from "../../contexts/UserContext";
import {
  doc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedButton from "../../components/ThemedButton";
import Loader from "../../components/Loader";
import ConfirmationModal from "../../components/ConfirmModal";
import {
  months,
  daysOfWeekShort,
  getDaysInMonth,
  getMonthName,
  years,
} from "../../utils/CalendarData";
import DayEntry from "../../components/DayEntry";
import CreateEntryForm from "../../components/CreateEntryForm";

const CalendarPage = () => {
  const { userData } = useUser();
  const currentUserId = userData?.user?.uid;

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const days = getDaysInMonth(selectedMonth, selectedYear);

  const [selectedDay, setSelectedDay] = useState(null);
  const [previouslySelectedDay, setPreviouslySelectedDay] = useState(null);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [dayEntry, setDayEntry] = useState(0);
  const { activeTheme, theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [entryData, setEntryData] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(
    currentUserId || null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sharedCalendars = userData?.sharedCalendars;
  const [isEditable, setIsEditable] = useState(false);
  const [borderRounded, setBorderRounded] = useState(true);

  const advancedFeatures = userData?.advancedUser || false;

  const entryMap = new Map();

  calendarEntries.forEach((entry) => {
    const key = `${entry.year}-${entry.day}`;
    if (!entryMap.has(key)) {
      entryMap.set(key, []);
    }
    entryMap.get(key).push(entry);
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchCalendarEntries = async () => {
    if (userData == null || selectedCalendar == null || selectedMonth == null) {
      console.error(
        "Invalid state: either userFirestore or selectedCalendar or selectedMonth is undefined."
      );
      return;
    }

    if (selectedCalendar === currentUserId) {
      setIsEditable(() => true);
    } else {
      setIsEditable(() => false);
    }

    const calendarToUse = selectedCalendar || currentUserId;
    const calendarEntryRef = collection(db, "calendarEntry");
    const q = query(
      calendarEntryRef,
      where("month", "==", selectedMonth),
      where("year", "==", selectedYear),
      where("userId", "==", calendarToUse)
    );

    try {
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCalendarEntries(entries);
      setHasLoaded(true);
      console.log("Calendar entries fetched: ", entries);
    } catch (error) {
      console.error("Error fetching calendar entries: ", error);
    }
  };

  const setDay = () => {
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === selectedMonth &&
      today.getFullYear() === selectedYear;
    const currentDay = isCurrentMonth
      ? days.find((day) => day && day.getDate() === today.getDate())
      : days.find((day) => day !== null);

    const dayOfMonth = currentDay.getDate();
    const year = currentDay.getFullYear();

    const entries = calendarEntries.filter(
      (entry) => entry.year === year && entry.day === dayOfMonth
    );
    setSelectedDay(selectedDay || currentDay);
    setDayEntry(entries);
    console.log(
      "Day set ",
      selectedDay ? `selectedDay: ${selectedDay}` : `currentDay: ${currentDay}`
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasLoaded && currentUserId) {
        console.log("Loading calendar entries...");
        setSelectedCalendar(() => currentUserId);
        fetchCalendarEntries();
      }
    }, 1000);

    if (hasLoaded) {
      setDay();
    }

    if (hasLoaded && selectedDay) {
      fetchCalendarEntries();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [userData, hasLoaded, selectedCalendar, selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value);
    let newYear = selectedYear;

    if (newMonth < selectedMonth && selectedMonth === 0) {
      newYear -= 1;
    } else if (newMonth > selectedMonth && selectedMonth === 11) {
      newYear += 1;
    }
    setSelectedMonth(() => newMonth);
    setSelectedYear(newYear);
    setIsDropdownOpen(false);
    fetchCalendarEntries();
  };

  const doesDayHaveEntry = (day) => {
    const key = `${day.getFullYear()}-${day.getDate()}`;
    return entryMap.has(key) && entryMap.get(key).length > 0;
  };

  const handleCreateEntry = async (newEntry) => {
    if (!newEntry?.note || !newEntry?.color) {
      console.error("Missing entry note or color");
      return;
    }

    try {
      const userId = userData?.user?.uid;
      const newEntryData = {
        userId: userId,
        year: selectedDay.getFullYear(),
        day: selectedDay.getDate(),
        createdAt: new Date().toISOString(),
        month: selectedMonth,
        note: newEntry.note,
        color: newEntry.color,
      };

      const docRef = await addDoc(
        collection(db, "calendarEntry"),
        newEntryData
      );

      setCalendarEntries((prevEntries) => [
        ...prevEntries,
        { ...newEntryData, id: docRef.id },
      ]);

      setDayEntry((prevEntries) => [
        ...prevEntries,
        { ...newEntryData, id: docRef.id },
      ]);
    } catch (error) {
      console.error("Error creating calendar entry:", error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const handleUpdateEntry = async (entry) => {
    if (!entry) {
      console.error("entry is undefined");
      return;
    }

    if (entry.userId !== userData?.user?.uid) {
      console.error("User does not have permission to update this entry");
      return;
    }

    const entryRef = doc(db, "calendarEntry", entry.id);

    try {
      await updateDoc(entryRef, {
        note: entry.note,
        color: entry.color,
      });

      setCalendarEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.id === entry.id ? { ...e, note: entry.note, color: entry.color } : e
        )
      );
      setSelectedDay(previouslySelectedDay);
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const confirmAction = (entry) => {
    if (actionType === "edit") {
      handleUpdateEntry(entryData);
    } else if (actionType === "delete") {
      handleDeleteEntry();
    }
    setShowModal(false);
  };

  const handleCalendarChange = (event) => {
    setSelectedCalendar(() => event.target.value);
    setIsDropdownOpen(false);
  };

  const handleDeleteEntry = async () => {
    if (!entryData?.id) {
      console.error("No entry ID found, cannot delete.");
      return;
    }

    if (entryData.userId !== userData?.user?.uid) {
      console.error("User does not have permission to delete this entry");
      return;
    }

    try {
      const entryRef = doc(db, "calendarEntry", entryData.id);
      await deleteDoc(entryRef);
      setCalendarEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryData.id)
      );
      setDayEntry(dayEntry.filter((entry) => entry.id !== entryData.id));
    } catch (error) {
      console.error("Error deleting calendar entry: ", error);
    }
  };

  const handleUpdateClick = async (entry) => {
    setEntryData(entry);
    setActionType("edit");
    setShowModal(true);
  };

  const handleDeleteClick = (entry) => {
    setEntryData(entry); // Set the specific entry for deletion
    setActionType("delete");
    setShowModal(true); // Show the confirmation modal
  };

  const handleDayClick = (day) => {
    setPreviouslySelectedDay(day);
    setSelectedDay(day);

    const dayOfMonth = day.getDate();
    const year = day.getFullYear();

    const entries = calendarEntries.filter(
      (entry) => entry.year === year && entry.day === dayOfMonth
    );
    setDayEntry(entries);
  };

  function renderEntryDivs(day) {
    const entries = entryMap.get(`${day.getFullYear()}-${day.getDate()}`);
    if (!entries || entries.length === 0) return null;

    return (
      <div
        className={style.entryContainer}
        style={{
          display: "flex",
          gap: "4px",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className={`${
              borderRounded
                ? style.calendarDayBannerRounded
                : style.calendarDayBanner
            }`}
            style={{
              backgroundColor: entry.color, // Color for the entry
            }}
            title={entry.note}
          />
        ))}
      </div>
    );
  }

  return (
    <Container fluid className={style.calendarContainer}>
      {hasLoaded ? (
        <>
          <Row style={{ alignContent: "center", padding: "0" }}>
            <Col xs={6} style={{ alignContent: "center" }}>
              {getMonthName(selectedMonth)} {selectedYear}
            </Col>
            <Col xs={4} style={{ textAlign: "right", alignContent: "center" }}>
              <ThemedButton
                size="small"
                fullWidth={false}
                onClick={() => setBorderRounded(!borderRounded)}
              >
                {borderRounded ? (
                  <i className="fa-regular fa-square"></i>
                ) : (
                  <i className="fa-regular fa-circle"></i>
                )}
              </ThemedButton>
            </Col>
            <Col xs={2} style={{ textAlign: "right", alignContent: "center" }}>
              <button
                onClick={toggleDropdown}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: theme[activeTheme].color,
                }}
                aria-label="Toggle Dropdown"
              >
                ☰ {/* Simple Hamburger Icon */}
              </button>
              {isDropdownOpen && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "10%",
                    margin: "0",
                    padding: "10px",
                    listStyle: "none",
                    backgroundColor: theme[activeTheme].panelColor,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    borderRadius: "4px",
                    zIndex: 100,
                  }}
                >
                  <li>
                    {" "}
                    {advancedFeatures ? (
                      <>
                        <Row style={{ paddingBottom: "5px" }}>
                          <Col>
                            <select
                              value={selectedCalendar}
                              onChange={handleCalendarChange}
                              style={{
                                backgroundColor: theme[activeTheme].panelColor,
                                color: theme[activeTheme].color,
                                borderColor: theme[activeTheme].color,
                              }}
                            >
                              {/* Option for personal calendar */}
                              <option value={currentUserId}>My Calendar</option>
                              {/* Options for shared calendars */}
                              {sharedCalendars?.map((calendar) => (
                                <option
                                  key={calendar.name}
                                  value={calendar.userId}
                                >
                                  {calendar.name}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </li>
                  <li>
                    <select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      style={{
                        backgroundColor: theme[activeTheme].panelColor,
                        color: theme[activeTheme].color,
                        borderColor: theme[activeTheme].color,
                      }}
                    >
                      {months.map((month) => (
                        <option key={month.name} value={month.value}>
                          {month.name} {selectedYear}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>
                    {/* Year Selector */}
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      style={{
                        backgroundColor: theme[activeTheme].panelColor,
                        color: theme[activeTheme].color,
                        borderColor: theme[activeTheme].color,
                      }}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
              )}
            </Col>
          </Row>
          <Row
            style={{
              background: `linear-gradient(180deg, ${theme[activeTheme].backgroundColor} 10%, ${theme[activeTheme].backgroundColorGradient} 90%)`,
              paddingBottom: "10px",
            }}
          >
            <Col>
              <div className={style.calendarGrid}>
                {daysOfWeekShort.map((day) => (
                  <div key={day}>
                    <p style={{ color: theme[activeTheme].color, margin: 0 }}>
                      {day}
                    </p>
                  </div>
                ))}
                {days.map((day, index) =>
                  day ? (
                    <ThemedButton
                      key={index}
                      className={`${style.calendarDay} ${
                        selectedDay?.getTime() === day.getTime()
                          ? style.selected
                          : ""
                      }`}
                      onClick={() => handleDayClick(day)}
                      style={{
                        backgroundColor: theme[activeTheme].panelColor,
                        borderRadius: borderRounded ? "50%" : "0",
                        color: theme[activeTheme].color,
                      }}
                    >
                      <p
                        className={`${
                          borderRounded
                            ? style.calendarDayNumberRounded
                            : style.calendarDayNumber
                        }`}
                      >
                        {day.getDate()}
                      </p>
                      {doesDayHaveEntry(day) ? renderEntryDivs(day) : null}
                    </ThemedButton>
                  ) : (
                    <div key={index} className={style.emptyDay}></div>
                  )
                )}
              </div>
            </Col>
          </Row>
          {isEditable ? (
            <>
              <CreateEntryForm
                isEditable={isEditable}
                theme={theme}
                activeTheme={activeTheme}
                advancedFeatures={advancedFeatures}
                onCreate={handleCreateEntry}
              />
              {dayEntry?.length > 0 && hasLoaded
                ? dayEntry?.map((entry) => (
                    <>
                      <DayEntry
                        key={entry.id}
                        entry={entry}
                        isEditable={isEditable}
                        theme={theme}
                        activeTheme={activeTheme}
                        advancedFeatures={advancedFeatures}
                        handleUpdateClick={handleUpdateClick}
                        handleDeleteClick={handleDeleteClick}
                        setDayEntry={setDayEntry}
                      />
                    </>
                  ))
                : null}
            </>
          ) : (
            <>
              <p>You do not have permission to edit this Calendar</p>
              {dayEntry?.length > 0 ? (
                dayEntry.map((entry) => (
                  <Row>
                    <Col key={entry.id} style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <p>
                          {new Date(entry.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p>{entry.note}</p>
                      </div>
                    </Col>
                  </Row>
                ))
              ) : (
                <Col>
                  <p>No entries for this day.</p>
                </Col>
              )}
            </>
          )}

          <div>
            <ConfirmationModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={confirmAction}
              message={
                actionType === "edit"
                  ? "Are you sure you want to update this existing entry?"
                  : "Are you sure you want to delete this entry?"
              }
            />
          </div>
        </>
      ) : (
        <Loader spinner text="Loading calendar, please wait" />
      )}
    </Container>
  );
};

export default CalendarPage;
