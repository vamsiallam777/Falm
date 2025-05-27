import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Toolbar,
  AppBar
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FilterList
} from '@mui/icons-material';
import CalendarDay from './CalendarDay';
import EventModal from './EventModal';
import EventList from './EventList';
import DayView from './DayView';
import { useEvents } from '../hooks/useEvents';
import { generateRecurringEvents } from '../utils/recurrence';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [dayViewDate, setDayViewDate] = useState(null);
    const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  
  // Generate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Get all events including recurring ones
  const allEvents = events.flatMap(event => {
    if (event.recurrence && event.recurrence.type !== 'none') {
      return generateRecurringEvents(event, startDate, endDate);
    }
    return [event];
  });
  // Filter events
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const calendarDays = [];
  let day = startDate;

  while (day <= endDate) {
    const dayEvents = filteredEvents.filter(event => 
      isSameDay(new Date(event.date), day)
    );    calendarDays.push(
      <CalendarDay
        key={day.toString()}
        day={day}
        currentDate={currentDate}
        events={dayEvents}
        onDayClick={handleDayClick}
        onDayDoubleClick={handleDayDoubleClick}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
      />
    );
    day = addDays(day, 1);
  }
  function handleDayClick(date) {
    // If it's a double-click or the date has no events, open the event modal
    const dayEvents = filteredEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
    
    if (dayEvents.length === 0) {
      setSelectedDate(date);
      setEditingEvent(null);
      setShowEventModal(true);
    } else {
      // Show day view with events for this date
      setDayViewDate(date);
    }
  }

  function handleDayDoubleClick(date) {
    // Always open event modal on double-click
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventModal(true);
  }

  function handleEventClick(event) {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setShowEventModal(true);
  }

  function handleEventDrop(eventId, newDate) {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const updatedEvent = {
        ...event,
        date: format(newDate, 'yyyy-MM-dd'),
        datetime: format(new Date(event.datetime.replace(/^\d{4}-\d{2}-\d{2}/, format(newDate, 'yyyy-MM-dd'))), 'yyyy-MM-dd\'T\'HH:mm')
      };
      updateEvent(updatedEvent);
    }
  }

  function handleSaveEvent(eventData) {
    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  }

  function handleDeleteEvent(eventId) {
    deleteEvent(eventId);
    setShowEventModal(false);
    setEditingEvent(null);
  }

  function navigateMonth(direction) {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  }

  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      maxWidth: '1400px', 
      margin: '0 auto',
      flexDirection: { xs: 'column', lg: 'row' }
    }}>
      <Paper elevation={3} sx={{ flex: 1, borderRadius: 2, overflow: 'hidden' }}>
        {/* Calendar Header */}
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <IconButton onClick={() => navigateMonth('prev')} size="large">
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  minWidth: '220px',
                  textAlign: 'center',
                  color: 'primary.main'
                }}
              >
                {format(currentDate, 'MMMM yyyy')}
              </Typography>
              <IconButton onClick={() => navigateMonth('next')} size="large">
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Filters */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', md: 'auto' }
            }}>
              <TextField
                size="small"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{ width: { xs: '100%', sm: 200 } }}
              />
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                  startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      <Chip label={category} size="small" />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Calendar Grid */}
        <Box sx={{ p: 2 }}>
          {/* Days of week header */}
          <Grid container sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  {day}
                </Box>
              </Grid>
            ))}
          </Grid>          {/* Calendar days */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {calendarDays}
          </Box>
        </Box>      </Paper>

      {/* Sidebar - EventList or DayView */}
      {dayViewDate ? (
        <DayView
          selectedDate={dayViewDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onClose={() => setDayViewDate(null)}
        />
      ) : (
        <EventList
          events={filteredEvents}
          onEventClick={handleEventClick}
          currentDate={currentDate}
        />
      )}

      {showEventModal && (
        <EventModal
          selectedDate={selectedDate}
          event={editingEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setShowEventModal(false)}
          existingEvents={events}
        />
      )}
    </Box>
  );
};

export default Calendar;