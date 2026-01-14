import { createContext, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';

interface BidDataResponse {
    Bids: any[]; // Or define a full Bid interface if you have time
    totalBids: number;
    acceptedBids: number;
    pendingBids: number;
}

interface ClientBidDataResponse {
    AllGigs: Gig[],
    totalGigs: number;
    activeGigs: number;
    assignedGigs: number
    totalBidsReceived: number

}

interface HirefreeLancerResponse {
    message: string,
    gig: Gig
}

interface GigContextType {
    loading: boolean;
    postGigs: (title: string, description: string, budget: string) => Promise<void>;
    fetchGigs: (search: string) => Promise<void>;
    gigs: Gig[];
    submitBid: (id: string, message: string, price: string) => Promise<boolean | null>;
    getFreeLancerBid: () => Promise<BidDataResponse | null>;
    getClientGigs: () => Promise<ClientBidDataResponse | null>;
    hireFreeLancer: (id: string) => Promise<HirefreeLancerResponse | null>;
}

interface Gig {
    _id: string;
    title: string;
    description: string;
    budget: string;
    status: "open" | "assigned"
    ownerName: string
    createdAt: string

}

const GigContext = createContext<GigContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export function GigProvider({ children }: { children: ReactNode }) {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);



    const postGigs = async (title: string, description: string, budget: string) => {
        try {
            const budgetInt = parseInt(budget)
            await axios.post(`${API_URL}/gigs`, {
                title, description, budget: budgetInt
            })

        } catch (err: any) {
            throw new Error((err as any).response?.data?.message || 'Failed to post gig');
        }
    }

    const fetchGigs = async (search: string = "") => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/gigs?search=${search}`);
            setGigs(res.data.data);
        } catch (err: any) {
            console.error("Fetch Gigs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const submitBid = async (id: string, message: string, price: string): Promise<boolean | null> => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/bids`, {
                gigId: id,
                message,
                price
            });
            // If backend returns a success flag, use it, otherwise assume success
            return typeof res.data?.success === 'boolean' ? res.data.success : true;
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to submit bid';
            throw new Error(message);
        } finally {
            setLoading(false);
        }


    }

    const getFreeLancerBid = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/bids/free`);
            return res.data.data;
        } catch (error: any) {
            console.error("Fetch Bids Error:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }
    const getClientGigs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/bids/client`);
            return res.data.data;
        } catch (error: any) {
            console.error("Fetch Bids Error:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const hireFreeLancer = async (bidId: string) => {
        try {
            setLoading(true);
            const res = await axios.patch(`${API_URL}/bids/${bidId}/hire`);
            return res.data;
        } catch (error: any) {
            console.error("Not able to Hire:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return (
        <GigContext.Provider value={{ loading, postGigs, fetchGigs, gigs, submitBid, getFreeLancerBid, getClientGigs, hireFreeLancer }}>
            {children}
        </GigContext.Provider>
    );
}

export function useGig() {
    const context = useContext(GigContext);
    if (context === undefined) {
        throw new Error('useGig must be used within an GigProvieder');
    }
    return context;
}

