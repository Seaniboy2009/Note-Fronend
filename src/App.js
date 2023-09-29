import Header from './components/Header'
import NoteListPage from './pages/NoteListPage'
import { Route, Routes } from 'react-router-dom'
import NotePage from './pages/NotePage';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<NoteListPage />} />
        <Route path='note/:id' element={<NotePage />} />
      </Routes>
    </div>
  );
}

export default App;
