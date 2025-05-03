import NoteListPage from "./pages/notes/NoteListPage";
import { Route, Routes } from "react-router-dom";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import NoteCreate from "./pages/notes/NoteCreate";
import ListPage from "./pages/lists/ListPage";
import HomePage from "./pages/HomePage";
import ListDetailPage from "./pages/lists/ListDetailPage";
import appStyle from "./styles/App.module.css";
import ListCreate from "./pages/lists/ListCreate";
import AccountPage from "./pages/account/AccountPage";
import NavBarComponent from "./components/NavBarComponent";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import CalendarPage from "./pages/calendar/CalendarPage";

function App() {
  return (
    <div id="theme" className={appStyle.Main}>
      <NavBarComponent />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/account" element={<AccountPage />} />
        <Route exact path="/notes" element={<NoteListPage />} />
        <Route exact path="/notes/note/:docId" element={<NoteDetailPage />} />
        <Route exact path="/notes/note/create" element={<NoteCreate />} />
        <Route path="/lists/" element={<ListPage />} />
        <Route path="/lists/list/:docId" element={<ListDetailPage />} />
        <Route path="/lists/list/create" element={<ListCreate />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}

export default App;
