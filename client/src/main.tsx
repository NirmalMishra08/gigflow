import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Gigfeed from './pages/Gigfeed';
import PostGig from './pages/PostGig';
import GigDetail from './pages/GigDetail';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelanceDashboard';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Public routes */}
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected routes */}
          <Route path="gigs" element={<Gigfeed/>} />
          <Route path="post-gig" element={<PostGig />} />
          <Route path="gigs/:id" element={<GigDetail />} />
          <Route path="client-dashboard" element={<ClientDashboard />} />
          <Route path="freelancer-dashboard" element={<FreelancerDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);