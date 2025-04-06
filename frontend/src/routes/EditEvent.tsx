import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import { useState, useEffect } from "react";
import { Event } from "@/models/event.model.ts";
import axios from "axios";

const EditEvent = () => {
  const { user, loading } = useAuth();
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

  if (loading || eventLoading) {
    return <div>Loading...</div>; // TODO: Replace with spinner/loading component
  }

  console.log("Organizer Info:");
  console.log(user);
  console.log("Admin ", user?.admin);
  console.log("User org id: ", user?.organizer?.id);
  console.log("ID: ", id);

  if (user && user.admin && user.organizer?.id === event?.clubId) {
    return <EventForm isEditing={true} />; // TODO: Could potentially pass in event as props since we load it here anyways
  } else {
    return <Navigate to="/" />; // TODO: Add toast notification saying user is not authorized
  }
};

export default EditEvent;
