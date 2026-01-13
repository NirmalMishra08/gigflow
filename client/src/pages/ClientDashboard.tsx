import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ClientDashboard() {
  const { user } = useAuth();

  // Mock data - replace with actual API call
  const postedGigs = [
    { id: '1', title: 'Web Development Project', bids: 5, status: 'Open' },
    { id: '2', title: 'Logo Design', bids: 3, status: 'Open' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <Link
            to="/post-gig"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Post New Gig
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
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Gigs Posted</h3>
            <p className="text-3xl font-bold text-gray-900">{postedGigs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Bids</h3>
            <p className="text-3xl font-bold text-gray-900">
              {postedGigs.reduce((sum, gig) => sum + gig.bids, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Gigs</h3>
            <p className="text-3xl font-bold text-gray-900">
              {postedGigs.filter(gig => gig.status === 'Open').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Posted Gigs</h2>
          {postedGigs.length === 0 ? (
            <p className="text-gray-600">You haven't posted any gigs yet.</p>
          ) : (
            <div className="space-y-4">
              {postedGigs.map((gig) => (
                <div
                  key={gig.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/gigs/${gig.id}`}
                        className="text-xl font-semibold text-blue-600 hover:underline"
                      >
                        {gig.title}
                      </Link>
                      <p className="text-gray-600 mt-1">{gig.bids} bids received</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {gig.status}
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

export default ClientDashboard;