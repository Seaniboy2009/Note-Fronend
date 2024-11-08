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
} from "firebase/firestore";
import { db } from "../../firebase";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedButton from "../../components/ThemedButton";

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

    const entryData = {
      userId: userId,
      year: entryYear,
      day: entryDay,
      createdAt: existingEntry
        ? existingEntry.createdAt
        : new Date().toISOString(),
      month: selectedMonth,
      note: note,
    };

    try {
      if (existingEntry) {
        // Update the existing entry
        const entryRef = doc(db, "calendarEntry", existingEntry.id);
        await updateDoc(entryRef, { note: note }); // Only update the note
        console.log("Calendar entry updated: ", existingEntry.id);

        // Update the entry in the local state
        setCalendarEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === existingEntry.id ? { ...entry, note: note } : entry
          )
        );
      } else {
        // Add a new entry if none exists
        const docRef = await addDoc(collection(db, "calendarEntry"), entryData);
        console.log("Calendar entry added with ID: ", docRef.id);

        // Update local state with the new entry
        setCalendarEntries([
          ...calendarEntries,
          { id: docRef.id, ...entryData },
        ]);
      }

      // Set the updated or new entry to dayEntry to reflect immediately
      setDayEntry(entryData);
    } catch (error) {
      console.error("Error adding/updating calendar entry: ", error);
    }
  };
  return (
    <Container className={style.calendarContainer}>
      <Row>
        <Col>
          <h2>Calendar Selection</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <label>
            Select Month:
            <select value={selectedMonth} onChange={handleMonthChange}>
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
                  } ${doesDayHaveEntry(day) ? style.crossedOut : ""}`}
                  onClick={() => handleDayClick(day)}
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
      <Row>
        <Col>
          <p>Selected day: {selectedDay?.toDateString()}</p>
          {dayEntry ? (
            <div>
              <p>Note: {dayEntry.note || "No note added."}</p>
            </div>
          ) : (
            <p>No entry for this day.</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <label>
            Add/Edit Note:
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note for this day"
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
      </Row>
    </Container>
  );
};

export default CalendarPage;
