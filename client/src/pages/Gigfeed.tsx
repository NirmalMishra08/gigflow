import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGig } from '../context/GigContext';

const Gigfeed = () => {
  const { gigs, fetchGigs, loading } = useGig();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGigs("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGigs(searchTerm);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex flex-col space-y-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore Opportunities
            </h1>
            <Link 
              to="/post-gig" 
              className="w-full md:w-auto text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-none transition-all active:scale-95"
            >
              Post a Gig
            </Link>
          </div>

          <form onSubmit={handleSearch} className="relative group w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative grow">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by skills, title, or keywords..."
                  className="pl-10 w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {gigs && gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gigs/${gig?._id}`}
              state={{ gigData: gig }}
              className="group bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg ${
                    gig.status === 'open' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {gig.status}
                  </span>
                  <span className="text-lg font-bold text-green-600">₹{gig.budget}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                  {gig.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {gig.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {gig.ownerName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Posted By</span>
                    <span className="text-sm font-semibold text-gray-700">{gig.ownerName}</span>
                  </div>
                </div>
                
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!gigs || gigs.length === 0) && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="mb-4 flex justify-center text-gray-300">
               <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
            <p className="text-gray-500 text-xl font-medium">No gigs found matching your search.</p>
            <button 
              onClick={() => fetchGigs("")}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigfeed;