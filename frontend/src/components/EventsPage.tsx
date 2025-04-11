import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { EventResponse, Event } from "@/models/event.model.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { SearchBar } from "@/components/SearchBar.tsx";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEventFilter, getEvents } from "@/api/events.data.ts";
import { LoadingOverlay } from "@/components/Spinner.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import EventRegistrationButton from "@/components/EventRegistrationButton";

interface EventsPageProps {
  view: "home" | "admin" | "user";
}

export const EventsPage: React.FC<EventsPageProps> = ({ view }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<getEventFilter>({
    eventName: "",
    eventLocation: "",
    date: undefined,
    hours: undefined,
    tags: [],
  });

  const [eventLoading, setEventLoading] = useState(true);
  const [events, setEvents] = useState<EventResponse>();
  const { user, userLoading } = useAuth();
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  useEffect(() => {
    const filterEvents = async () => {
      setEventLoading(true);
      try {
        let events;

        if (view === "user") {
          events = await getEvents(
            filters,
            limit,
            (currentPage - 1) * limit,
            user?.id
          );
        } else if (view === "home") {
          events = await getEvents(filters, limit, (currentPage - 1) * limit);
        }

        // TODO: Add logic to do different logic handling for non-user page if re-using this component
        // For instance, above only works for home and user views. If need to fetch all organization events for organization page, remove userId argument and instead provide clubId argument
        /* For organization page, something like this (can probably pass down clubId from props):
        NOTE: Since we are reusing components, would have to pass both clubId and view since the ID could refer to either userId or clubId (organization ID)

        const events = await getEvents(
          filters,
          limit,
          (currentPage - 1) * limit,
          undefined, clubId
        );
        */

        setEvents(events);
        console.log("Fetched events:", events);

        if (user) {
          const userRegisteredEventIds = user.registrations?.map(
            (e: any) => e.eventId
          );
          console.log("Registered Events:", userRegisteredEventIds);
          setRegisteredEventIds(userRegisteredEventIds);
        }

        setTotalPages(Math.ceil(events.total / limit));
        setEventLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    filterEvents();
  }, [filters, currentPage, limit, user]);

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const emptyDashboard = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-md text-center">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No events found
        </h3>
      </div>
    </div>
  );

  return (
    <>
      {eventLoading || userLoading ? (
        <LoadingOverlay message="Filtering events..." />
      ) : (
        <div className="space-y-8 p-4">
          <div className="flex items-center justify-between bg-gray-200 p-2 mb-4">
            <h2 className="text-xl tracking-tight font-bold">
              {view === "user"
                ? "User Registrations"
                : view === "admin"
                ? "Organizer Events"
                : "Browse Events"}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-between my-3">
            <SearchBar filters={filters} setFilters={setFilters} />
            <div className="flex justify-end mb-6">
              <Select
                onValueChange={handleLimitChange}
                defaultValue={limit.toString()}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Cards per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {!events || events?.events.length === 0 ? (
            <>{emptyDashboard}</>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.events.map((event: Event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="mb-2">{event.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        Organized by {event.organizer.name}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {event.date} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{event.hours} hour(s)</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        {event.organizer.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2 py-1 my-2 text-xs mb-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-2 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        {user ? (
                          <EventRegistrationButton
                            eventId={event.id}
                            isRegistered={registeredEventIds?.includes(
                              event.id
                            )}
                            setRegisteredEventIds={setRegisteredEventIds}
                            userId={user.id}
                          />
                        ) : (
                          // If user is not logged in, disable button
                          <Button disabled={true}>Register</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 4) }).map(
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {totalPages > 5 && (
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      )}
    </>
  );
};
