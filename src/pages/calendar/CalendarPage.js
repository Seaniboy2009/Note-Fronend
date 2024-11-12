import React, { useEffect, useState } from "react";
import style from "../../styles/Calendar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useUser } from "../../contexts/UserContext";
import appStyle from "../../styles/App.module.css";
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
const months = [
  { name: "January", value: 0 },
  { name: "February", value: 1 },
  { name: "March", value: 2 },
  { name: "April", value: 3 },
  { name: "May", value: 4 },
  { name: "June", value: 5 },
  { name: "July", value: 6 },
  { name: "August", value: 7 },
  { name: "September", value: 8 },
  { name: "October", value: 9 },
  { name: "November", value: 10 },
  { name: "December", value: 11 },
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CalendarPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [dayEntry, setDayEntry] = useState(null); // Entry details for selected day
  const [note, setNote] = useState(""); // Note input state
  const userFirestore = useUser();
  const currentUserId = userFirestore?.user?.uid;
  const { activeTheme, theme } = useTheme();
  const [color, setColor] = useState("#ff0000"); // default color red
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [entryData, setEntryData] = useState(null);
  const [actionType, setActionType] = useState(null);
  // Get array of days for a specific month in the current year
  const getDaysInMonth = (month) => {
    const days = [];
    const year = new Date().getFullYear();
    const date = new Date(year, month, 1);

    // Calculate the first day position (e.g., if the month starts on a Wednesday, add empty days for Monday and Tuesday)
    const firstDayOfWeek = (date.getDay() + 6) % 7; // Adjust Sunday as the last day of the week
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null); // Empty cells to align the starting day
    }

    // Populate the calendar days for the month
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  const days = getDaysInMonth(selectedMonth);

  // Fetch calendar entries from Firebase for the selected month
  useEffect(() => {
    const fetchCalendarEntries = async () => {
      if (!userFirestore) return; // Ensure user is signed in
      console.log(
        "Fetching calendar entries for user: ",
        userFirestore.user.uid
      );

      const calendarEntryRef = collection(db, "calendarEntry");
      const q = query(
        calendarEntryRef,
        where("month", "==", selectedMonth),
        where("year", "==", new Date().getFullYear()),
        where("userId", "==", currentUserId) // Only fetch entries for the signed-in user
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCalendarEntries(entries);
      console.log("Loaded calendar entries for user: ", entries);
      setHasLoaded(true);
    };

    fetchCalendarEntries();
  }, [selectedMonth, currentUserId]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    setSelectedDay(null);
    setDayEntry(null); // Clear the day entry when month changes
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const dayOfMonth = day.getDate();
    const year = day.getFullYear();

    // Find entry for the selected day and display its details
    const entry = calendarEntries.find(
      (entry) => entry.year === year && entry.day === dayOfMonth
    );
    setDayEntry(entry || null);
    setNote(entry?.note || ""); // Load existing note if available
  };

  const doesDayHaveEntry = (day) => {
    const dayOfMonth = day.getDate();
    const year = day.getFullYear();
    return calendarEntries.some(
      (entry) => entry.year === year && entry.day === dayOfMonth
    );
  };

  const handleEntryClick = async () => {
    const userId = userFirestore?.user?.uid;
    if (!selectedDay) return;

    const entryYear = selectedDay.getFullYear();
    const entryDay = selectedDay.getDate();

    const existingEntry = calendarEntries.find(
      (entry) => entry.year === entryYear && entry.day === entryDay
    );

    const newEntryData = {
      userId: userId,
      year: entryYear,
      day: entryDay,
      createdAt: existingEntry
        ? existingEntry.createdAt
        : new Date().toISOString(),
      month: selectedMonth,
      note: note,
      color: color, // Now included in both new and existing entries
    };

    if (existingEntry) {
      // Set the data and show confirmation modal if updating
      setEntryData({ ...newEntryData, id: existingEntry.id });
      setShowModal(true);
      setActionType("edit"); // Set action type to 'edit' (update)
    } else {
      // Save new entry directly
      await saveEntry(newEntryData);
    }
  };

  const saveEntry = async (data) => {
    try {
      if (data.id) {
        // Update the existing entry with both note and color
        const entryRef = doc(db, "calendarEntry", data.id);
        await updateDoc(entryRef, { note: data.note, color: data.color });
        console.log("Calendar entry updated: ", data.id);

        // Update the entry in the local state
        setCalendarEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === data.id
              ? { ...entry, note: data.note, color: data.color }
              : entry
          )
        );
      } else {
        // Add a new entry if none exists
        const docRef = await addDoc(collection(db, "calendarEntry"), data);
        console.log("Calendar entry added with ID: ", docRef.id);

        // Update local state with the new entry
        setCalendarEntries([...calendarEntries, { id: docRef.id, ...data }]);
      }

      // Set the updated or new entry to dayEntry to reflect immediately
      setDayEntry(data);
      setEntryData(null);
    } catch (error) {
      console.error("Error adding/updating calendar entry: ", error);
    }
  };

  const handleDeleteClick = (existingEntry) => {
    console.log("Entry for deletion: ", existingEntry); // Debugging line
    setEntryData(existingEntry); // Set the entry data to delete
    setActionType("delete"); // Set action type to 'delete'
    setShowModal(true); // Show confirmation modal
  };

  const deleteEntry = async () => {
    console.log("Deleting entry with ID: ", entryData?.id); // Debugging line
    if (!entryData?.id) {
      console.error("No entry ID found, cannot delete.");
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
  };

  const confirmAction = () => {
    console.log("Confirmed action: ", actionType);
    if (actionType === "edit") {
      saveEntry(entryData); // Update the entry if 'edit'
    } else if (actionType === "delete") {
      deleteEntry(); // Delete the entry if 'delete'
    }
    setShowModal(false); // Close the modal after action
  };
  return (
    <Container fluid className={style.calendarContainer}>
      {hasLoaded ? (
        <>
          <Row>
            <Col>
              <h2>Calendar Selection</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <label>
                Select Month:
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  style={{
                    backgroundColor: theme[activeTheme].pannelColor,
                    color: theme[activeTheme].color,
                    borderColor: theme[activeTheme].color,
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Days in {months[selectedMonth].name}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Render days of the week headers */}
              <div className={style.calendarGrid}>
                {daysOfWeek.map((day, index) => (
                  <div key={index} className={style.dayHeader}>
                    {day}
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
                        backgroundColor:
                          doesDayHaveEntry(day) &&
                          calendarEntries.find(
                            (entry) => entry.day === day.getDate()
                          )?.color
                            ? calendarEntries.find(
                                (entry) => entry.day === day.getDate()
                              ).color
                            : theme[activeTheme].pannelColor, // Use theme color if no entry
                      }}
                    >
                      {day.getDate()}
                    </ThemedButton>
                  ) : (
                    <div key={index} className={style.emptyDay}></div>
                  )
                )}
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={dayEntry && dayEntry.note ? "" : "No note added"}
                  style={{
                    width: "100%",
                    minHeight: "50px",
                    backgroundColor: theme[activeTheme].pannelColor,
                    color: theme[activeTheme].color,
                    borderColor: theme[activeTheme].color,
                  }}
                />
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label>
                Choose Color:
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <ThemedButton onClick={() => handleEntryClick()}>
                Save Entry
              </ThemedButton>
            </Col>
            <Col>
              {dayEntry ? (
                <div>
                  <ThemedButton onClick={() => handleDeleteClick(dayEntry)}>
                    Delete Entry
                  </ThemedButton>
                </div>
              ) : (
                <p>No entry for this day.</p>
              )}
            </Col>
          </Row>
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
        <Loader spinner text="Loading notes, please wait" />
      )}
    </Container>
  );
};

export default CalendarPage;
