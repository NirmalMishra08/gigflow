import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import BidsModal from '../components/BidsModal';
import { useGig } from '../context/GigContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function ClientDashboard() {
  const { user } = useAuth();
  const { getClientGigs, hireFreeLancer } = useGig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [currentBids, setCurrentBids] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getClientGigs();
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchDashboardData();
  }, []);

  const openBids = async (gig: any) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bids/${gig._id}`);
      setCurrentBids(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load bids');
      setIsModalOpen(false);

    } finally {
      setModalLoading(false);
    }
  };

  const handleHireReject = async (bidId: string) => {
    try {
      setLoading(true);
      await hireFreeLancer(bidId);
      toast.success('Freelancer hired successfully');
      setIsModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <span className='ml-2 text-blue-600/80 text-sm'>Click on a gig card to manage bids</span>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Gigs</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalGigs}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Bids Received</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBidsReceived}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Active Gigs</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeGigs}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Posted Gigs</h2>
          {!stats.AllGigs || stats.AllGigs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">You haven't posted any gigs yet.</p>
              <Link to="/post-gig" className="text-blue-600 font-medium hover:underline">Create your first gig now</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {stats.AllGigs.map((gig: any) => (
                <div
                  key={gig._id}
                  onClick={() => openBids(gig)}
                  className="group flex justify-between items-center border border-gray-100 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {gig.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        Budget: <span className="text-gray-900 font-medium">₹{gig.budget}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(gig.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {gig.status}
                    </span>
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BidsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gigTitle={selectedGig?.title || ""}
        bids={currentBids}
        onAction={handleHireReject}
        loading={modalLoading}
      />
    </div>
  );
}

export default ClientDashboard;