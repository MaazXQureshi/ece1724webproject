import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RegisterEdit from "@/components/RegisterEdit";

const EditOrganizer = () => {
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

  if (user && user.admin && user.organizer?.id === parseInt(id!)) {
    return <RegisterEdit isEditing={true} />;
  } else {
    console.log("Back here?");
    return <Navigate to="/" />;
  }
};

export default EditOrganizer;
