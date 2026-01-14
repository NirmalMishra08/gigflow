import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGig } from '../context/GigContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function FreelancerDashboard() {
  const { user } = useAuth();
  const [bidData, setBidData] = useState<{
    Bids: any[],
    totalBids: number,
    acceptedBids: number,
    pendingBids: number
  } | null>(null);

  const { getFreeLancerBid } = useGig();

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const data = await getFreeLancerBid();
        if (data) setBidData(data);
      } catch {
        toast.error('Failed to load your bids');
      }
    };
    fetchMyBids();
  }, []);

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
            <p className="text-3xl font-bold text-gray-900">{bidData?.totalBids}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Accepted Bids</h3>
            <p className="text-3xl font-bold text-gray-900">
              {bidData?.acceptedBids}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Bids</h3>
            <p className="text-3xl font-bold text-gray-900">
              {bidData?.pendingBids}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Bids</h2>
          {bidData?.Bids.length === 0 ? (
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
              {bidData?.Bids.map((bid) => (
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
                        {bid.gigId.title}
                      </Link>
                      <p className="text-gray-600 mt-1">Your bid: ₹{bid.price}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <span
                        className={`px-3 py-1 flex items-center justify-center rounded-full text-sm font-medium ${bid.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {bid.status}
                      </span>
                      <div className='text-gray-600'>
                        Their Budget: ₹{bid.gigId.budget}
                      </div>
                    </div>

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