import { Outlet } from 'react-router-dom';
import App from '../App';

export default function Layout() {
  return (
    <div className="text-center mt-9">
      <main>
        <Outlet />
        <App />
      </main>
    </div>
  );
}
