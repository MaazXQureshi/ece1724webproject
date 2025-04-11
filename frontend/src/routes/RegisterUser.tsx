import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RegisterEdit from "@/components/RegisterEdit";

const RegisterUser = () => {
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  if (userLoading) {
    return <div>Loading...</div>; // TODO: Replace with spinner/loading component
  }

  if (user) {
    toast.error("User already logged in", {
      position: "top-center",
      style: {
        backgroundColor: "#a6334e",
        color: "white",
      },
    });
    navigate("/");
  } else {
    return <RegisterEdit isEditing={false} />;
  }
};

export default RegisterUser;
