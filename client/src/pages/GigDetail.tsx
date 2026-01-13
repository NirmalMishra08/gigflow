import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GigDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // Mock data - replace with actual API call
  const gig = {
    id: id,
    title: 'Web Development Project',
    description: 'We are looking for an experienced full-stack developer to build a modern web application. The project involves React frontend and Node.js backend.',
    budget: '$5000',
    postedBy: 'Client A',
    postedDate: '2024-01-15',
    status: 'Open',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/gigs"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Gigs
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
              <p className="text-gray-600">Posted by {gig.postedBy} on {gig.postedDate}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {gig.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{gig.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Budget</h2>
            <p className="text-2xl font-bold text-blue-600">{gig.budget}</p>
          </div>

          {user && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a Bid</h2>
              <p className="text-gray-600 mb-4">
                Interested in this project? Submit your bid and proposal.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Submit Bid
              </button>
            </div>
          )}

          {!user && (
            <div className="border-t pt-6">
              <p className="text-gray-600 mb-4">
                Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to submit a bid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GigDetail;