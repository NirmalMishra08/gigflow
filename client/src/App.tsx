import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { GigProvider } from './context/GigContext';

function App() {
  return (
    <AuthProvider>
      <GigProvider>
        <div className="min-h-full flex flex-col">
          <Navbar />
          <main className="flex-grow h-screen ">
            <Outlet />
          </main>
          <Footer />
        </div>
      </GigProvider>
    </AuthProvider>
  );
}

export default App;