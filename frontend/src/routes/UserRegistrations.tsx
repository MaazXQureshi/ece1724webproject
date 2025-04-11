import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { EventsPage } from "@/components/EventsPage";
import { Navbar } from "@/components/Navbar.tsx";
import { toast } from "sonner";

const UserRegistrations = () => {
  const { user, userLoading } = useAuth();
  const { id } = useParams();

  if (userLoading) {
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
    toast.error("Unauthorized access", {
      position: "top-center",
      style: {
        backgroundColor: "#a6334e",
        color: "white",
      },
    });
    console.log("Back here?");
    return <Navigate to="/" />;
  }
};

export default UserRegistrations;
