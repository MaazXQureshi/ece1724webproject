// src/pages/events.jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { EventResponse, Event } from "@/models/event.model.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { SearchBar } from "@/components/SearchBar.tsx";
import { useEffect, useState } from "react";
import { getEventFilter, getEvents } from "@/api/events.data.ts";
import { LoadingOverlay } from "@/components/Spinner.tsx";

export const EventsDashboard = () => {
  const [filters, setFilters] = useState<getEventFilter>({
    eventName: '',
    eventLocation: '',
    date: undefined,
    hours: undefined,
    tags: []
  });

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventResponse>();

  useEffect(() => {
    const filterEvents = async () => {
      setLoading(true);
      try {
        const events = await getEvents(filters);

        setEvents(events);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    filterEvents();
  }, [filters]);

  const emptyDashboard = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-md text-center">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground"/>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No events found
        </h3>
      </div>
    </div>
  )

  return (
    <>
      { loading ? <LoadingOverlay message="Filtering events..."/> : (
        <div className="space-y-8 p-4">
          <div className="flex items-center justify-between bg-gray-200 p-2 mb-4">
            <h2 className="text-xl tracking-tight font-bold">Browse Events</h2>
          </div>
          <SearchBar filters={ filters } setFilters={ setFilters }/>
          { (!events || events?.events.length === 0) ? <>{ emptyDashboard }</> : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              { events.events.map((event: Event) => (
                <Card key={ event.id } className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={ event.imageUrl }
                        alt={ event.name }
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2">{ event.name }</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">
                      Organized by { event.organizer.name }
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4"/>
                        <span>{ event.date } at { event.time }</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4"/>
                        <span>{ event.location }</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4"/>
                        <span>{ event.hours } hours</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      { event.organizer.tags?.map((tag) => (
                        <Badge
                          key={ tag }
                          variant="secondary"
                          className="px-2 py-1 my-2 text-xs mb-2"
                        >
                          { tag }
                        </Badge>
                      )) }
                    </div>

                    <div className="mt-2 flex justify-between">
                      <Button variant="outline">Learn More</Button>
                      <Button>Sign Up</Button>
                    </div>
                  </CardContent>
                </Card>
              )) }
            </div>
          ) }
        </div>
      ) }
    </>
  )
}