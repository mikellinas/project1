import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <span className="text-indigo-600 font-bold text-lg tracking-tight">Project1</span>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 font-medium text-sm' : 'text-gray-600 hover:text-indigo-600 text-sm'
              }
            >
              Profile
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-medium text-sm' : 'text-gray-600 hover:text-indigo-600 text-sm'
                }
              >
                Admin Panel
              </NavLink>
            )}
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
            <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">Profile</NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-700 text-sm">Admin Panel</NavLink>
            )}
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-left text-red-600">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
