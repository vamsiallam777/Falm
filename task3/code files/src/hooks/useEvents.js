import { useState, useEffect } from 'react';

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error parsing saved events:', error);
        setEvents([]);
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  };
};