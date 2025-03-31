import { Input } from "@/components/ui/input.tsx";
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Search, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu.tsx";
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { format } from "date-fns";
import { getEventFilter } from "@/api/events.data.ts";
import { useState } from "react";

export interface ISearchBar {
  filters: getEventFilter,
  setFilters: (filters: getEventFilter) => void,
}

export const SearchBar = ({ filters, setFilters }: ISearchBar) => {
  const [tempName, setTempName] = useState<string>('');
  const [tempLocation, setTempLocation] = useState<string>('');

  const setNameFilter = (eventName: string) => {
    setFilters({ ...filters, eventName });
    setTempName('');
  };

  const setLocationFilter = (eventLocation: string) => {
    setFilters({ ...filters, eventLocation });
    setTempLocation('');
  };

  const setDateFilter = (date: Date | undefined) => {
    setFilters({ ...filters, date });
  };

  const setHoursFilter = (hours: number | undefined) => {
    setFilters({ ...filters, hours });
  };

  const setTagsFilter = (tags: string[]) => {
    setFilters({ ...filters, tags });
  };

  const clearFilters = () => {
    setFilters({
      eventName: '',
      eventLocation: '',
      date: undefined,
      hours: undefined,
      tags: []
    });
  };


  return (
    <div className="flex flex-col md:flex-row gap-4 ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Name Filter */ }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4"/>
                Name
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-7 w-64 p-2">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                  <Input
                    placeholder="Search event names..."
                    className="pl-10"
                    value={ tempName }
                    onChange={ (e) => setTempName(e.target.value) }
                  />
                </div>
                <Button onClick={ () => setNameFilter(tempName) }>
                  Add
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Filter */ }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4"/>
                Location
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                  <Input
                    placeholder="Search event locations..."
                    className="pl-10"
                    value={ tempLocation }
                    onChange={ (e) => setTempLocation(e.target.value) }
                  />
                </div>
                <Button onClick={ () => setLocationFilter(tempLocation) }>
                  Add
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hours Filter */ }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Clock className="h-4 w-4"/>
                Hours
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2">
              <div className="grid grid-cols-2 gap-2">
                { [1, 2, 3, 4, 5, 6].map((hours) => (
                  <Button
                    key={ hours }
                    variant={ filters.hours === hours ? 'default' : 'ghost' }
                    size="sm"
                    onClick={ () => setHoursFilter(filters.hours === hours ? undefined : hours) }
                  >
                    { hours }
                  </Button>
                )) }
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */ }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4"/>
                Date
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-4 space-y-4 mx-4">
              <div>
                <p className="text-sm font-medium mb-2">Date</p>
                <Calendar
                  mode="single"
                  selected={ filters.date }
                  onDayClick={ setDateFilter }
                  className="rounded-md border"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Filter */ }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4"/>
                Tags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2">
              <div className="grid grid-cols-2 gap-2">
                {/*TODO: add tag filters*/ }
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          { (filters.eventName || filters.eventLocation || filters.date || filters.hours || filters.tags.length > 0) && (
            <Button variant="ghost" onClick={ clearFilters } className="gap-1">
              <X className="h-4 w-4"/>
              Clear filters
            </Button>
          ) }
        </div>

        {/* Active filters display */ }
        <div className="flex flex-wrap gap-2">
          { filters.eventName && (
            <Badge className="gap-1">
              Name: { filters.eventName }
              <Button variant={ "ghost" } className="w-3 h-3" onClick={ () => setNameFilter('') }>
                <X className="h-3 w-3 cursor-pointer"/>
              </Button>
            </Badge>
          ) }
          { filters.eventLocation && (
            <Badge className="gap-1">
              Location: { filters.eventLocation }
              <Button variant={ "ghost" } className="w-3 h-3" onClick={ () => setLocationFilter('') }>
                <X className="h-3 w-3 cursor-pointer"/>
              </Button>
            </Badge>
          ) }
          { filters.date && (
            <Badge className="gap-1">
              Date: { format(filters.date, 'MMM dd, yyyy') }
              <Button variant={ "ghost" } className="w-3 h-3" onClick={ () => setDateFilter(undefined) }>
                <X className="h-3 w-3 cursor-pointer"/>
              </Button>
            </Badge>
          ) }
          { filters.hours && (
            <Badge className="gap-1">
              Hours: { filters.hours }
              <Button variant={ "ghost" } className="w-3 h-3" onClick={ () => setHoursFilter(undefined) }>
                <X className="h-3 w-3 cursor-pointer"/>
              </Button>
            </Badge>
          ) }
          { filters.tags.map(tag => (
            <Badge key={ tag } className="gap-1">
              { tag }
              <Button variant={ "ghost" } className="w-3 h-3" onClick={ () => setTagsFilter([]) }>
                <X className="h-3 w-3 cursor-pointer"/>
              </Button>
            </Badge>
          )) }
        </div>
      </div>

    </div>
  )
}