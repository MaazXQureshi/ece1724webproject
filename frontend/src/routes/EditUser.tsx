import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RegisterEdit from "@/components/RegisterEdit";
import { toast } from "sonner";

const EditUser = () => {
  const { user, userLoading } = useAuth();
  const { id } = useParams();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (user && user.id === parseInt(id!)) {
    return <RegisterEdit isEditing={true} />;
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

export default EditUser;
