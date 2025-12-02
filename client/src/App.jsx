
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import TakeQuizPage from "./pages/TakeQuizPage";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}> <Dashboard/></ProtectedRoute>}/>
        <Route path="/userDashboard" element={<UserDashboard/>}/>
        <Route path="/TakeQuizPage" element={<TakeQuizPage/>}/>
        </Routes>
    </>
  );
}

export default App;
