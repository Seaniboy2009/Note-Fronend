import Header from './components/Header'
import NoteListPage from './pages/NoteListPage'
import { Route, Routes } from 'react-router-dom'
import NoteDetailPage from './pages/NoteDetailPage';
import NoteCreate from './pages/NoteCreate';
import ListPage from './pages/ListPage';
import HomePage from './pages/HomePage';
import ListDetailPage from './pages/ListDetailPage';
import appStyle from './styles/App.module.css'
import ListCreate from './pages/ListCreate';

function App() {
  return (
    <div id='theme' className={appStyle.Main}>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='notes/' element={<NoteListPage />} />
        <Route exact path='notes/note/:id' element={<NoteDetailPage />} />
        <Route exact path='notes/note/create' element={<NoteCreate />} />
        <Route path='lists/' element={<ListPage />} />
        <Route path='lists/list/:id' element={<ListDetailPage />} />
        <Route path='/lists/list/create' element={<ListCreate />} />
      </Routes>
    </div>
  );
}

export default App;
