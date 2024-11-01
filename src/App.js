import NoteListPage from "./pages/notes/NoteListPage";
import { Route, Routes } from "react-router-dom";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import NoteCreate from "./pages/notes/NoteCreate";
import ListPage from "./pages/lists/ListPage";
import HomePage from "./pages/HomePage";
import ListDetailPage from "./pages/lists/ListDetailPage";
import appStyle from "./styles/App.module.css";
import ListCreate from "./pages/lists/ListCreate";
import NoteEditPage from "./pages/notes/NoteEditPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/account/AccountPage";
import SearchPage from "./pages/SearchPage";
import NavBarComponent from "./components/NavBarComponent";
import ListAllPage from "./utils/ListAllPage";
import TestExternalDBAPI from "./pages/TestExternalDBAPI";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import SignOut from "./pages/auth/SignOut";

function App() {
  return (
    <div id="theme" className={appStyle.Main}>
      <NavBarComponent />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route exact path="/account" element={<AccountPage />} />
        {/* <Route exact path='/test' element={<SearchPage />} /> */}
        <Route exact path="/notes" element={<NoteListPage />} />
        <Route exact path="/notes/note/:docId" element={<NoteDetailPage />} />
        <Route exact path="/notes/note/create" element={<NoteCreate />} />
        <Route exact path="/notes/note/edit:docId" element={<NoteEditPage />} />
        <Route path="/lists/" element={<ListPage />} />
        <Route path="/lists/list/:docId" element={<ListDetailPage />} />
        <Route path="/lists/list/create" element={<ListCreate />} />
        <Route path="/all" element={<ListAllPage />} />
        <Route path="/test" element={<TestExternalDBAPI />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </div>
  );
}

export default App;
