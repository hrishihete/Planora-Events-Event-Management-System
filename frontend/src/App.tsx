import { Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventListPage from "./pages/EventListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EventListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/events/new"
          element={
            <RequireAuth>
              <CreateEventPage />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:id"
          element={
            <RequireAuth>
              <EventDetailPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
