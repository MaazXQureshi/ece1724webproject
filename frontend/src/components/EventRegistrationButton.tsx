import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  eventId: number;
  isRegistered: boolean;
  userId: number;
  setRegisteredEventIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const EventRegistrationButton = ({
  eventId,
  isRegistered: initiallyRegistered,
  userId,
  setRegisteredEventIds,
}: Props) => {
  const [isRegistered, setIsRegistered] = useState(initiallyRegistered);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsRegistered(initiallyRegistered);
  }, [initiallyRegistered]);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isRegistered) {
        await axios.delete(`/api/registrations`, {
          data: { userId, eventId },
        });

        setIsRegistered(false);
        setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
        toast.success("Successfully unregistered from event", {
          position: "top-center",
          style: {
            // For some reason className does not work, so I just used this overwrite for now
            backgroundColor: "#a6334e",
            color: "white",
          },
          duration: 3000,
        });
      } else {
        await axios.post(`/api/registrations`, { userId, eventId });

        setIsRegistered(true);
        setRegisteredEventIds((prev) => [...prev, eventId]);
        toast.success("Successfully registered for event", {
          position: "top-center",
          style: {
            // For some reason className does not work, so I just used this overwrite for now
            backgroundColor: "#22c55e",
            color: "white",
          },
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to register", {
        position: "top-center",
        style: {
          backgroundColor: "#ef4444",
          color: "white",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={isRegistered ? "secondary" : "default"}
      className="transition-shadow hover:shadow-md"
    >
      {loading
        ? isRegistered
          ? "Unregistering..."
          : "Registering..."
        : isRegistered
        ? "Unregister"
        : "Register"}
    </Button>
  );
};

export default EventRegistrationButton;
