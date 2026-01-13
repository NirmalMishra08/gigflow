import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGig } from '../context/GigContext'; // Import your custom hook

const Gigfeed = () => {
  const { gigs, fetchGigs, loading } = useGig();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch gigs on component mount
  useEffect(() => {
    fetchGigs("");
  }, []);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGigs(searchTerm);
  };

  if (loading) return <div className="text-center py-10">Loading Gigs...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Browse Gigs</h1>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search gigs..."
              className="border p-2 rounded-lg w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Search</button>
          </form>

          <Link to="/post-gig" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Post a Gig
          </Link>
        </div>

        {/* Gig Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs && gigs.map((gig) => (
            <Link
              key={gig.id}
              to={`/gigs/${gig.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-t-4 border-blue-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{gig.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">₹{gig.budget}</span>
                <div className='flex flex-col items-center justify-center gap-3'>
                  <span className={`text-xs px-2 py-1 rounded ${gig.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {gig.status.toUpperCase()}
                  </span>
                  <span className="text-black font-bold">Posted By: <span className='text-xs'>{gig.ownerName}</span></span>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!gigs || gigs.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No gigs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigfeed;