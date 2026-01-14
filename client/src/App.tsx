import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { GigProvider } from './context/GigContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <GigProvider>
        <div className="min-h-full flex flex-col">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#111827', color: '#fff' },
            }}
          />
          <Navbar />
          <main className="grow h-full ">
            <Outlet />
          </main>
          <Footer />
        </div>
      </GigProvider>
    </AuthProvider>
  );
}

export default App;