import Header from './components/Header'
import NoteListPage from './pages/NoteListPage'
import { Route, Routes } from 'react-router-dom'
import NotePage from './pages/NotePage';
import NoteCreate from './pages/NoteCreate';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<NoteListPage />} />
        <Route path='note/:id' element={<NotePage />} />
        <Route path='note/create' element={<NoteCreate />} />
      </Routes>
    </div>
  );
}

export default App;
