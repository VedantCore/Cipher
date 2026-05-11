import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SecureChat from './features/messages/components/SecureChat'; // 1. Import your actual chat component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Add the route for your chat dashboard */}
        <Route path="/chat" element={<SecureChat recipient={{id: '1', username: 'test', public_key: '...'}} />} /> 
        
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;