import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board';
import Write from './pages/Write';

function App() {
    return (
        <>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/write" element={<Write />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
