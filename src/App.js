import Header from './components/Header'
import NoteListPage from './pages/NoteListPage'
import { Route, Routes } from 'react-router-dom'
import NotePage from './pages/NotePage';
import NoteCreate from './pages/NoteCreate';
import ListPage from './pages/ListPage';
import HomePage from './pages/HomePage';
import ListDetailPage from './pages/ListDetailPage';
import appStyle from './styles/App.module.css'

function App() {
  return (
    <div className={appStyle.Max}>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='notes/' element={<NoteListPage />} />
        <Route exact path='notes/note/:id' element={<NotePage />} />
        <Route exact path='notes/note/create' element={<NoteCreate />} />
        <Route path='lists/' element={<ListPage />} />
        <Route path='lists/list/:id' element={<ListDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
