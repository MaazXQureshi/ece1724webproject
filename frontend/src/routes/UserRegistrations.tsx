import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { EventsPage } from "@/components/EventsPage";
import { Navbar } from "@/components/Navbar.tsx";

const UserRegistrations = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Organizer Info:");
  console.log(user);
  console.log("Admin ", user?.admin);
  console.log("User org id: ", user?.organizer?.id);
  console.log("ID: ", id);

  if (user && user.id === parseInt(id!)) {
    return (
      <>
        <Navbar />
        <EventsPage view="user" />
      </>
    );
  } else {
    console.log("Back here?"); // TODO: Add toast notification saying user is not authorized
    return <Navigate to="/" />;
  }
};

export default UserRegistrations;
