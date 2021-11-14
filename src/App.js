import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
function App() {
  const [isOnline, setIsOnline] = useState(false);
  return (
    <div className="app">
      <Navbar isOnline={isOnline} />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route
          exact
          path="/home"
          element={<Home emitOnlineStatus={() => setIsOnline(true)} />}
        />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
