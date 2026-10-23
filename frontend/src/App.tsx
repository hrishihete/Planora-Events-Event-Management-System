import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventListPage from "./pages/EventListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EventListPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Route>
    </Routes>
  );
}
