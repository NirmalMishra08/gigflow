import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>
        <Outlet /> 
      </main>
    </>
  );
}