import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">GigFlow</h3>
            <p className="text-sm">
              Connecting talented freelancers with exciting projects. Your next opportunity awaits.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gigs" className="hover:text-white transition-colors">
                  Browse Gigs
                </Link>
              </li>
              <li>
                <Link to="/post-gig" className="hover:text-white transition-colors">
                  Post a Gig
                </Link>
              </li>
              <li>
                <Link to="/client-dashboard" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/freelancer-dashboard" className="hover:text-white transition-colors">
                  Freelancer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">
              Have questions? We're here to help.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GigFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

