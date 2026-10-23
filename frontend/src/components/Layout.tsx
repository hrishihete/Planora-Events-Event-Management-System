import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm tracking-wide ${isActive ? "text-planora-rose font-semibold" : "text-slate-600 hover:text-planora-plum"}`;

export default function Layout() {
  const { user, isManager, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <NavLink to="/" className="font-script text-3xl text-slate-800">
            Planora Events
          </NavLink>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            {user && (
              <NavLink to="/" className={navClass}>
                {isManager ? "Inbox" : "My Events"}
              </NavLink>
            )}
            {user && !isManager && (
              <NavLink to="/events/new" className={navClass}>
                Request Event
              </NavLink>
            )}
            {user ? (
              <>
                <span className="text-sm text-slate-500">{user.fullName}</span>
                <button type="button" onClick={logout} className="text-sm text-planora-rose">
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Creating unforgettable experiences through meticulous planning.</p>
          <p>info@planoraevents.com · (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
}
