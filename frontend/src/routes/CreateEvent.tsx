import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();

  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with spinner/loading component
  }

  console.log("Organizer Info:");
  console.log(user);
  console.log("Admin ", user?.admin);
  console.log("User org id: ", user?.organizer?.id);
  console.log("ID: ", id);

  if (user && user.admin) {
    return <EventForm isEditing={false} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default CreateEvent;
