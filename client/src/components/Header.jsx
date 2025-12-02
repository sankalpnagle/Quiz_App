import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-semibold text-indigo-600">
          Quiz App
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* {user?.role === "admin" && (
            <>
              <Link
                to="/admin/quizzes/new"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                Create Quiz
              </Link>

              <Link
                to="/admin/quizzes"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                All Quizzes
              </Link>
            </>
          )} */}

        
          { user && <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>}
        
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-slate-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-3">
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/quizzes/new"
                className="block text-sm font-medium text-slate-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                Create Quiz
              </Link>

              <Link
                to="/admin/quizzes"
                className="block text-sm font-medium text-slate-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                All Quizzes
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
