import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      setIsOpen(false);
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            GigFlow
          </Link>

          {/* Hamburger Icon (Mobile Only) */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/gigs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Browse Gigs
            </Link>
            
            {user && (
              <>
                <Link to="/post-gig" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Post Gig
                </Link>
                <Link to="/client-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Client Dashboard
                </Link>
                <Link to="/freelancer-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Freelancer Dashboard
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l pl-6 ml-2">
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              <Link
                to="/gigs"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
              >
                Browse Gigs
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/post-gig"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                  >
                    Post Gig
                  </Link>
                  <Link
                    to="/client-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                  >
                    Client Dashboard
                  </Link>
                  <Link
                    to="/freelancer-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
                  >
                    Freelancer Dashboard
                  </Link>
                </>
              )}

              <div className="mt-4 px-4 pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-500 text-sm italic">Signed in as {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;