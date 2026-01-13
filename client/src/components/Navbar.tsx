import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            GigFlow
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/gigs"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Browse Gigs
            </Link>
            
            {user && (
              <>
                <Link
                  to="/post-gig"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Post Gig
                </Link>
                <Link
                  to="/client-dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Client Dashboard
                </Link>
                <Link
                  to="/freelancer-dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Freelancer Dashboard
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {user.name}
                </span>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;