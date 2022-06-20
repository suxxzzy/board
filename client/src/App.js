import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board';
import Post from './pages/Post';
import Write from './pages/Write';
import Modify from './pages/Modify';

function App() {
    return (
        <>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/board/:id" element={<Post />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/board/:id/modify" element={<Modify />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
