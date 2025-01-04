import React, { useEffect, useState } from "react";
import style from "../../styles/Calendar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useUser } from "../../contexts/UserContext";
import appStyle from "../../styles/App.module.css";
import AddEntryModal from "../../components/AddEntryModal";
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
  years,
} from "../../utils/CalendarData";

const CalendarPage = () => {
  const userFirestore = useUser();
  const currentUserId = userFirestore?.user?.uid;

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const days = getDaysInMonth(selectedMonth, selectedYear);
  const [selectedDay, setSelectedDay] = useState(days[0]); // Default to the first day of the month
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [dayEntry, setDayEntry] = useState(0); // Entry details for selected day
  const [note, setNote] = useState(""); // Note input state
  const { activeTheme, theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [entryData, setEntryData] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(currentUserId || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const sharedCalendars = userFirestore?.sharedCalendars;
  const isEditable = selectedCalendar === currentUserId;

  const advancedFeatures = userFirestore?.advancedUser || false;

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

  useEffect(() => {
    if (!userFirestore?.user?.uid) {
      console.error("User is not authenticated");
      return;
    }
    setSelectedCalendar(userFirestore.user.uid);
  }, [userFirestore]);

  useEffect(() => {
    const fetchCalendarEntries = async () => {
      if (
        userFirestore == null ||
        selectedCalendar == null ||
        selectedMonth == null
      ) {
        console.error(
          "Invalid state: either userFirestore or selectedCalendar or selectedMonth is undefined."
        );
        return;
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
        setHasLoaded(true); // Set this after fetching
      } catch (error) {
        console.error("Error fetching calendar entries: ", error);
      }
    };

    fetchCalendarEntries();
  }, [
    selectedMonth,
    selectedCalendar,
    userFirestore,
    selectedYear,
    calendarEntries,
    currentUserId,
  ]);

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value);
    let newYear = selectedYear;

    if (newMonth < selectedMonth && selectedMonth === 0) {
      newYear -= 1; // Wrap from January to December of the previous year
    } else if (newMonth > selectedMonth && selectedMonth === 11) {
      newYear += 1; // Wrap from December to January of the next year
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDay(null);
    setDayEntry(null); // Clear the day entry when month changes
    setIsDropdownOpen(false);

    console.log("Selected year: ", selectedYear);
    console.log("Selected month: ", selectedMonth);
    console.log("Selected day: ", selectedDay);
  };

  const doesDayHaveEntry = (day) => {
    const key = `${day.getFullYear()}-${day.getDate()}`;
    return entryMap.has(key) && entryMap.get(key).length > 0;
  };

  const handleCreateEntry = async ({ note, color }) => {
    const userId = userFirestore?.user?.uid;
    if (!selectedDay) {
      console.error("No day selected for creating entry");
      return;
    }
    if (userId !== userFirestore?.user?.uid) {
      return;
    }

    const entryYear = selectedDay.getFullYear();
    const entryDay = selectedDay.getDate();

    console.log("Creating entry for: ", entryYear, entryDay);

    // Prepare the entry data, including default values for new entries
    const newEntryData = {
      userId: userId,
      year: entryYear,
      day: entryDay,
      createdAt: new Date().toISOString(),
      month: selectedMonth,
      note: note || "", // Use the note passed or set empty for new entries
      color: color || "", // Use the color passed or set empty for new entries
    };

    const docRef = await addDoc(collection(db, "calendarEntry"), newEntryData);
    console.log("Created new calendar entry with ID: ", docRef.id);

    // Update the state with the newly created entry
    setCalendarEntries((prevEntries) => [
      ...prevEntries,
      { id: docRef.id, ...newEntryData },
    ]);

    setSelectedDay(null); // Clear the selected day after creating
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    console.log("Selected year: ", selectedYear);
    console.log("Selected month: ", selectedMonth);
    console.log("Selected day: ", selectedDay);
  };

  const handleUpdateEntry = async (entry) => {
    if (!entry) {
      console.error("entry is undefined");
      return;
    }

    if (entry.userId !== userFirestore?.user?.uid) {
      console.error("User does not have permission to update this entry");
      return;
    }

    console.log("Updating entry: ", entry);

    const userId = userFirestore?.user?.uid;
    const entryDataToSave = {
      userId: userId,
      year: selectedDay.getFullYear(),
      day: selectedDay.getDate(),
      createdAt: new Date().toISOString(),
      month: selectedMonth,
      note: entry.note,
      color: entry.color,
    };

    const entryRef = doc(db, "calendarEntry", entry.id);
    await updateDoc(entryRef, {
      note: entry.note,
      color: entry.color,
    });

    console.log("Calendar entry updated: ", entry.id);

    setCalendarEntries((prevEntries) =>
      prevEntries.map((entryItem) =>
        entryItem.id === entry.id
          ? { ...entryItem, ...entryDataToSave }
          : entryItem
      )
    );

    setSelectedDay(null); // Clear the selected day after updating
  };

  // Modal confirmation action buttons
  const confirmAction = (entry) => {
    console.log("Confirmed action: ", actionType);
    if (actionType === "edit") {
      handleUpdateEntry(entryData);
    } else if (actionType === "delete") {
      handleDeleteEntry();
    }
    setShowModal(false);
  };

  const handleCalendarChange = (event) => {
    setSelectedCalendar(event.target.value);
    setIsDropdownOpen(false);
  };

  const handleDeleteEntry = async () => {
    console.log("Deleting entry with ID: ", entryData?.id); // Debugging line
    if (!entryData?.id) {
      console.error("No entry ID found, cannot delete.");
      return;
    }

    if (entryData.userId !== userFirestore?.user?.uid) {
      console.error("User does not have permission to delete this entry");
      return;
    }

    try {
      const entryRef = doc(db, "calendarEntry", entryData.id);
      await deleteDoc(entryRef); // Delete from Firestore
      console.log("Calendar entry deleted: ", entryData.id);

      // Remove the deleted entry from local state
      setCalendarEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryData.id)
      );
      setEntryData(null); // Clear entry data after deletion
    } catch (error) {
      console.error("Error deleting calendar entry: ", error);
    }

    setSelectedDay(null); // Clear the selected day after deletion
  };

  const handleUpdateClick = async (entry) => {
    console.log("Updating entry: ", entry);
    setEntryData(entry);
    setActionType("edit");
    setShowModal(true); // Show the confirmation modal
  };

  const handleDeleteClick = (entry) => {
    setEntryData(entry); // Set the specific entry for deletion
    setActionType("delete");
    setShowModal(true); // Show the confirmation modal
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    console.log("Selected day: ", day);
    const dayOfMonth = day.getDate();
    const year = day.getFullYear();

    // Filter all entries for the selected day
    const entries = calendarEntries.filter(
      (entry) => entry.year === year && entry.day === dayOfMonth
    );
    setDayEntry(entries); // Store as an array of entries
    setNote(""); // Clear the note input for a new entry
    console.log("Selected year: ", selectedYear);
    console.log("Selected month: ", selectedMonth);
    console.log("Selected day: ", selectedDay);
  };

  return (
    <Container fluid className={style.calendarContainer}>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={6}>
              <h4>Calendar</h4>
            </Col>
            <Col xs={6} style={{ textAlign: "right" }}>
              <button
                onClick={toggleDropdown}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
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
                    backgroundColor: theme[activeTheme].pannelColor,
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
                                backgroundColor: theme[activeTheme].pannelColor,
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
                        backgroundColor: theme[activeTheme].pannelColor,
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
                        backgroundColor: theme[activeTheme].pannelColor,
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
          <Row>
            <Col>
              <div className={style.calendarGrid}>
                {daysOfWeekShort.map((day) => (
                  <div key={day} className={style.dayHeader}>
                    <p>{day}</p>
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
                      } ${doesDayHaveEntry(day) ? "entryActive" : ""}`}
                      onClick={() => handleDayClick(day)}
                      style={{
                        backgroundColor: theme[activeTheme].pannelColor,
                      }}
                    >
                      <p className={style.calendarDayNumber}>{day.getDate()}</p>
                      {doesDayHaveEntry(day) ? (
                        <div className={style.entryContainer}>
                          {entryMap
                            .get(`${day.getFullYear()}-${day.getDate()}`)
                            ?.map((entry, idx) => (
                              <div
                                key={idx}
                                className={style.calendarDayBanner}
                                style={{ backgroundColor: entry.color }}
                                title={entry.note}
                              ></div>
                            ))}
                        </div>
                      ) : null}
                    </ThemedButton>
                  ) : (
                    <div key={index} className={style.emptyDay}></div>
                  )
                )}
              </div>
            </Col>
          </Row>
          <br />
          {isEditable ? (
            <>
              {dayEntry?.length > 0 ? (
                dayEntry.map((entry) => (
                  <Row
                    key={entry.id}
                    style={{ marginBottom: "10px" }}
                    xs
                    lg="4"
                  >
                    <Col xs={2}>
                      <p>{entry.day}</p>
                      <p>
                        {new Date(entry.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </Col>
                    <Col xs={6}>
                      {" "}
                      <textarea
                        disabled={!isEditable}
                        value={entry.note}
                        onChange={(e) =>
                          setDayEntry((prev) =>
                            prev.map((item) =>
                              item.id === entry.id
                                ? { ...item, note: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder={entry.note ? "" : "No note added"}
                        style={{
                          flex: 1, // Makes the textarea take up available space
                          height: "auto",
                          backgroundColor: theme[activeTheme].pannelColor,
                          color: theme[activeTheme].color,
                          border: "0",
                          padding: "8px", // Add padding for a better user experience
                        }}
                      />
                    </Col>

                    <Col style={{ display: "grid", gap: "5px" }}>
                      <ThemedButton
                        fullWidth={false}
                        size="small"
                        onClick={() => handleUpdateClick(entry)}
                      >
                        Update
                      </ThemedButton>
                      <ThemedButton
                        onClick={() => handleDeleteClick(entry)}
                        fullWidth={false}
                        size="small"
                      >
                        Delete
                      </ThemedButton>
                    </Col>
                    {/* Display color picker only if advanced features are enabled */}
                    {advancedFeatures ? (
                      <Col>
                        <label>Choose Color:</label>
                        <input
                          type="color"
                          value={entry.color || "#000000"} // Default color if entry.color is undefined
                          onChange={(e) =>
                            setDayEntry((prev) =>
                              prev.map((item) =>
                                item.id === entry.id
                                  ? { ...item, color: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      </Col>
                    ) : null}
                  </Row>
                ))
              ) : (
                <Row>
                  <Col>
                    <p>No entries for this day.</p>
                  </Col>
                </Row>
              )}
              <Row>
                <button
                  className={appStyle.ButtonCreate}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <i className="fa-sharp fa-solid fa-plus" />
                </button>
              </Row>
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
                          alignItems: "center", // Aligns items vertically
                          gap: "10px", // Adds space between the textarea and button
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
              <Row>
                <button
                  className={appStyle.ButtonCreate}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <i className="fa-sharp fa-solid fa-plus" />
                </button>
              </Row>
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
            <AddEntryModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreateEntry}
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
