import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import { useState, useEffect } from "react";
import { Event } from "@/models/event.model.ts";
import { toast } from "sonner";
import axios from "axios";

const EditEvent = () => {
  const { user, userLoading } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        const eventData = response.data;
        setEvent(eventData);
      } catch (error) {
        console.log("Failed to get event with id {}", id);
        console.error(error);
      } finally {
        setEventLoading(false); // Mark event loading as complete
      }
    };

    fetchEvent();
  }, [id]);

  if (userLoading || eventLoading) {
    return <div>Loading...</div>; // TODO: Replace with spinner/loading component
  }

  console.log("Organizer Info:");
  console.log(user);
  console.log("Admin ", user?.admin);
  console.log("User org id: ", user?.organizer?.id);
  console.log("ID: ", id);

  if (user && user.admin && user.organizer?.id === event?.clubId) {
    return <EventForm isEditing={true} />;
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

export default EditEvent;
