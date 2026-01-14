interface Bid {
    _id: string;
    price: number;
    message: string;
    status: string;
    freeLancerId: { name: string; _id: string }; // Assuming you populated this
}

interface BidsModalProps {
    isOpen: boolean;
    onClose: () => void;
    gigTitle: string;
    bids: Bid[];
    onAction: (bidId: string) => void;
    loading: boolean;
}

const BidsModal = ({ isOpen, onClose, gigTitle, bids, onAction, loading }: BidsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                {/* Modal Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bids Received</h2>
                        <p className="text-sm text-blue-600 font-medium">{gigTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : bids.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No bids have been submitted for this gig yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {bids.map((bid) => (
                                <div key={bid._id} className="border rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1 items-center justify-center">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-900">{bid.freeLancerId?.name || "Freelancer"}</span>
                                            <span className="h-fit text-center text-green-600 font-bold flex items-center justify-center">₹{bid.price}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm italic">"{bid.message}"</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {bid.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => onAction(bid._id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Hire
                                                </button>

                                            </>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${bid.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {bid.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidsModal;