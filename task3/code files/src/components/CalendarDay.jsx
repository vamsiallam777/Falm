import React, { useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import {
  Paper,
  Box,
  Typography,
  Chip,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCalendarDay = styled(Paper, {
  shouldForwardProp: (prop) => !['isToday', 'isCurrentMonth', 'dragOver'].includes(prop),
})(({ theme, isToday, isCurrentMonth, dragOver }) => ({
  minHeight: theme.breakpoints.down('md') ? 80 : 120,
  padding: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: isCurrentMonth ? theme.palette.background.paper : alpha(theme.palette.action.disabled, 0.1),
  ...(isToday && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    border: `2px solid ${theme.palette.primary.main}`,
  }),
  ...(dragOver && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    border: `2px dashed ${theme.palette.success.main}`,
  }),
  '&:hover': {
    backgroundColor: isCurrentMonth 
      ? alpha(theme.palette.action.hover, 0.05)
      : alpha(theme.palette.action.disabled, 0.15),
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2],
  },
  [theme.breakpoints.down('md')]: {
    minHeight: 60,
    padding: theme.spacing(0.5),
  },
}));

const EventChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'eventCategory',
})(({ theme, eventCategory }) => {
  const categoryColors = {
    Work: '#1976d2',
    Personal: '#d32f2f',
    Health: '#2e7d32',
    Social: '#ed6c02',
    Travel: '#7b1fa2',
    Other: '#0288d1',
  };

  return {
    fontSize: '0.7rem',
    height: 20,
    margin: '1px 0',
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: categoryColors[eventCategory] || theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: alpha(categoryColors[eventCategory] || theme.palette.primary.main, 0.8),
      transform: 'translateY(-1px)',
    },
  };
});

const CalendarDay = ({ day, currentDate, events, onDayClick, onDayDoubleClick, onEventClick, onEventDrop }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
      onEventDrop(eventId, day);
    }
  };

  const handleEventDragStart = (e, event) => {
    e.dataTransfer.setData('text/plain', event.id);
  };

  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentDate);
  return (    <StyledCalendarDay
      elevation={0}
      isToday={isToday}
      isCurrentMonth={isCurrentMonth}
      dragOver={dragOver}
      onClick={() => onDayClick(day)}
      onDoubleClick={() => onDayDoubleClick && onDayDoubleClick(day)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isToday ? 700 : 600,
          color: isCurrentMonth ? 'text.primary' : 'text.disabled',
          mb: 0.5
        }}
      >
        {format(day, 'd')}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
        {events.slice(0, 3).map((event, index) => (
          <EventChip
            key={`${event.id}-${index}`}
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.65rem' }}>
                  {event.title}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.8 }}>
                  {format(new Date(event.datetime), 'HH:mm')}
                </Typography>
              </Box>
            }
            eventCategory={event.category}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            draggable
            onDragStart={(e) => handleEventDragStart(e, event)}
          />
        ))}
        {events.length > 3 && (
          <Chip
            label={`+${events.length - 3} more`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.6rem',
              height: 18,
              color: 'text.secondary',
              borderColor: 'divider'
            }}
          />
        )}
      </Box>
    </StyledCalendarDay>
  );
};

export default CalendarDay;