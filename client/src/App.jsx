
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import TakeQuizPage from "./pages/TakeQuizPage";
import Header from "./components/Header";

function App() {


  return (
    <>
    <div>
      <Header/>
    </div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}> <Dashboard/></ProtectedRoute>}/>
        <Route path="/userDashboard" element={<UserDashboard/>}/>
        <Route path="/TakeQuizPage/:id" element={<TakeQuizPage/>}/>
        </Routes>
    </>
  );
}

export default App;
