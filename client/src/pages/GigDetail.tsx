import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useGig } from "../context/GigContext";
import toast from "react-hot-toast";

function GigDetail() {
  const { user } = useAuth();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const currentGig = location.state?.gigData;
  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gig not found</h1>
            <p className="text-gray-600 mb-6">
              Please go back to the gig list and open a gig again.
            </p>
            <Link
              to="/gigs"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { submitBid } = useGig();

  const handleSubmit = async (id: string, message: string, price: string) => {

    setLoading(true);

    try {
      await submitBid(id, message, price);
      toast.success('Bid submitted');
      navigate('/gigs');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  }


  // Mock data - replace with actual API call
  const gig = {
    id: currentGig._id,
    title: currentGig.title,
    description: currentGig.description,
    budget: `${currentGig.budget}`,
    postedBy: currentGig.ownerName,
    postedDate: currentGig.createdAt,
    status: currentGig.status,
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
            <p className="text-2xl font-bold text-blue-600">₹{gig.budget}</p>
          </div>

          {user && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a Bid</h2>
              <p className="text-gray-600 mb-4">
                Interested in this project? Submit your bid and proposal.
              </p>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Submit Your Bid Price" className="border my-4 px-3 py-2 rounded-2xl" />
              <textarea className="rounded-3xl w-full h-fit border p-4" placeholder="Submit Your Message for the owners" onChange={(e) => setMessage(e.target.value)} name="message" value={message} id="">
              </textarea>
              <button
                disabled={loading}
                onClick={() => handleSubmit(gig.id, message, price)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Bid'}
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