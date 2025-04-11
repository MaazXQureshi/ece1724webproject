import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RegisterEdit from "@/components/RegisterEdit";
import { toast } from "sonner";

const EditOrganizer = () => {
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

  if (user && user.admin && user.organizer?.id === parseInt(id!)) {
    return <RegisterEdit isEditing={true} />;
  } else {
    console.log("Back here?");
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

export default EditOrganizer;
