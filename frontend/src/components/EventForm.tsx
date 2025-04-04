import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EventForm = ({ isEditing }: { isEditing: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    name: "",
    time: "",
    location: "",
    info: "",
    hours: 0,
    imageUrl: "",
    clubId: 0,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user, loading } = useAuth(); // TODO: Should probably use a better name like userLoading
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (isEditing && id && user) {
          const response = await axios.get(`/api/events/${id}`);
          let eventData = response.data;

          if (eventData.time) {
            const utcDate = new Date(eventData.time); // Convert string to Date for form, but actually send it in UTC (since backend uses that)
            const localDate = new Date(
              utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
            );
            eventData.time = localDate.toISOString().slice(0, 16);
          }

          setEventData(eventData);
        }
      } catch (error) {
        console.error("Failed to get event with id", id);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvent();
  }, [isEditing, id, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEventData((prev) => ({
      ...prev,
      [name]: name === "hours" ? Number(value) || 0 : value,
    }));

    // if (type === "datetime-local") {
    //   setEventData((prev) => ({
    //     ...prev,
    //     time: new Date(value).toISOString(),
    //   }));
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Add validation

    setError("");
    setMessage("");

    // Set correct club before sending
    if (user && user.organizer) {
      eventData.clubId = user.organizer.id;
    }

    const eventPayload = {
      ...eventData,
      time: new Date(eventData.time).toISOString(), // Ensure time is always ISO 8601 (This is in UTC which is what backend stores it as)
    };

    console.log("Event info to send:");
    console.log(eventPayload);

    try {
      if (isEditing) {
        await axios.put(`/api/events/${id}`, eventPayload);
        setMessage("Event updated successfully.");
      } else {
        await axios.post("/api/events", eventPayload);
        setMessage("Event created successfully.");
      }

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError("Error creating/updating event. Please try again.");
    }
  };

  if (loading || eventLoading) {
    return <div>Loading...</div>; // TODO: Replace with spinner/loading component
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Event" : "Create Event"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="time">Date/Time</Label>
          <Input
            id="time"
            name="time"
            type="datetime-local"
            value={eventData?.time || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="info">Info</Label>
          <Textarea
            id="info"
            name="info"
            value={eventData.info}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="hours">Hours</Label>
          <Input
            id="hours"
            name="hours"
            type="number"
            value={eventData.hours}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
