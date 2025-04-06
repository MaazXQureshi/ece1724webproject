import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RegisterEdit from "@/components/RegisterEdit";

const EditUser = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.id === parseInt(id!)) {
    return <RegisterEdit isEditing={true} />;
  } else {
    return <Navigate to="/" />; // TODO: Add toast notification saying user is not authorized
  }
};

export default EditUser;
