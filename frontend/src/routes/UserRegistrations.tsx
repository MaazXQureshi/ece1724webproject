import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserEventsPage } from "@/components/UserEventsPage";

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

  if (user && !user.admin && user.id === parseInt(id!)) {
    return <UserEventsPage />;
  } else {
    console.log("Back here?");
    return <Navigate to="/" />;
  }
};

export default UserRegistrations;
