import Header from './components/Header'
import NoteListPage from './pages/notes/NoteListPage'
import { Route, Routes } from 'react-router-dom'
import NoteDetailPage from './pages/notes/NoteDetailPage';
import NoteCreate from './pages/notes/NoteCreate';
import ListPage from './pages/lists/ListPage';
import HomePage from './pages/HomePage';
import ListDetailPage from './pages/lists/ListDetailPage';
import appStyle from './styles/App.module.css'
import ListCreate from './pages/lists/ListCreate';
import NoteEditPage from './pages/notes/NoteEditPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div id='theme' className={appStyle.Main}>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='notes/' element={<NoteListPage />} />
        <Route exact path='notes/note/:id' element={<NoteDetailPage />} />
        <Route exact path='notes/note/create' element={<NoteCreate />} />
        <Route exact path='notes/note/edit:id' element={<NoteEditPage />} />
        <Route path='lists/' element={<ListPage />} />
        <Route path='lists/list/:id' element={<ListDetailPage />} />
        <Route path='/lists/list/create' element={<ListCreate />} />
      </Routes>
    </div>
  );
}

export default App;
