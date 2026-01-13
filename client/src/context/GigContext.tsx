import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios, { Axios } from 'axios';

interface GigContextType {
    loading: boolean;
    postGigs: (title: string, description: string, budget: string) => Promise<void>;
    fetchGigs: (search: string) => Promise<void>;
    gigs: Gig[];
    // checkAuth: () => Promise<void>;
}

interface Gig {
    id: string;
    title: string;
    description: string;
    budget: string;
    status: "open" | "assigned"
    ownerName: string

}

const GigContext = createContext<GigContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export function GigProvider({ children }: { children: ReactNode }) {
    const [gig, setGig] = useState<Gig | null>(null);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);



    const postGigs = async (title: string, description: string, budget: string) => {
        try {
            const budgetInt = parseInt(budget)
            console.log(budgetInt, title)
            const res = await axios.post(`${API_URL}/gigs`, {
                title, description, budget: budgetInt
            })

            // if(res.data.success == true){
            //     toast.success()
            // }
            // console.log(res.data.success);
            // setGig(res.data.)

        } catch (err: any) {
            throw new Error((err as any).response?.data?.message || 'Failed to post gig');
        }
    }

    const fetchGigs = async (search: string = "") => {
        try {
            setLoading(true);
            // We use withCredentials: true (set globally earlier)
            const res = await axios.get(`${API_URL}/gigs?search=${search}`);
            console.log(res.data.data)
            setGigs(res.data.data); 
        } catch (err: any) {
            console.error("Fetch Gigs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GigContext.Provider value={{ loading, postGigs, fetchGigs, gigs }}>
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

