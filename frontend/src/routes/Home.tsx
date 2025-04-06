import { Navbar } from "@/components/Navbar.tsx";
// import { EventsDashboard } from "@/components/EventsDashboard.tsx";
import { EventsPage } from "@/components/EventsPage";

export const Home = () => {
  return (
    <>
      <Navbar />
      <EventsPage view="home" />
    </>
  );
};
