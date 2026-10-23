import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm tracking-wide ${isActive ? "text-planora-rose font-semibold" : "text-slate-600 hover:text-planora-plum"}`;

export default function Layout() {
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
            <NavLink to="/" className={navClass}>
              Events
            </NavLink>
            <NavLink to="/events/new" className={navClass}>
              Request Event
            </NavLink>
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
