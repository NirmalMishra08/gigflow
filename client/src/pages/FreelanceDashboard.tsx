import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FreelancerDashboard() {
  const { user } = useAuth();

  // Mock data - replace with actual API call
  const myBids = [
    { id: '1', gigTitle: 'Web Development Project', amount: '$4500', status: 'Pending' },
    { id: '2', gigTitle: 'Logo Design', amount: '$400', status: 'Accepted' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <Link
            to="/gigs"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Gigs
          </Link>
        </div>

        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Welcome back, <span className="font-semibold">{user.name}</span>!
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Bids</h3>
            <p className="text-3xl font-bold text-gray-900">{myBids.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Accepted Bids</h3>
            <p className="text-3xl font-bold text-gray-900">
              {myBids.filter(bid => bid.status === 'Accepted').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Bids</h3>
            <p className="text-3xl font-bold text-gray-900">
              {myBids.filter(bid => bid.status === 'Pending').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Bids</h2>
          {myBids.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't submitted any bids yet.</p>
              <Link
                to="/gigs"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Available Gigs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myBids.map((bid) => (
                <div
                  key={bid.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/gigs/${bid.id}`}
                        className="text-xl font-semibold text-blue-600 hover:underline"
                      >
                        {bid.gigTitle}
                      </Link>
                      <p className="text-gray-600 mt-1">Your bid: {bid.amount}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bid.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;