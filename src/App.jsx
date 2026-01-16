import './App.css';
import Navbar from './components/navbar.jsx'
import BGContainer from './components/background';
import MainContent from './components/maincontent';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Sidebar from './components/sidebar';

function createMainContentWrapper(basePath) {
    return function MainContentWrapper() {
        const { filePath } = useParams();
        return <MainContent url={`${basePath}/${filePath}`} />;
    };
}
const NotesWrapper = createMainContentWrapper('content/notes');

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="App">
        <Navbar />
        <BGContainer />
        <div className="mainLayout">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainContent url={`content/articles/welcomepage.md`}/>} />
            <Route path="notes/:filePath" element={<NotesWrapper />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
