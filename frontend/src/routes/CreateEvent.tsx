import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import EventForm from "@/components/EventForm";

const CreateEvent = () => {
  const { user, userLoading } = useAuth();
  const { id } = useParams();

  if (userLoading) {
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
    toast.error("Unauthorized access", {
      position: "top-center",
      style: {
        backgroundColor: "#a6334e",
        color: "white",
      },
    });
    return <Navigate to="/" />;
  }
};

export default CreateEvent;
