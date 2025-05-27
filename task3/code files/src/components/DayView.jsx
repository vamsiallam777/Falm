import React from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  Divider,
  IconButton,
  Fade
} from '@mui/material';
import {
  Event,
  Close,
  AccessTime,
  Description
} from '@mui/icons-material';

const DayView = ({ selectedDate, events, onEventClick, onClose }) => {
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  ).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const categoryColors = {
    Work: '#1976d2',
    Personal: '#d32f2f',
    Health: '#2e7d32',
    Social: '#ed6c02',
    Travel: '#7b1fa2',
    Other: '#0288d1',
  };

  return (
    <Fade in={true}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: { xs: '100%', lg: 350 }, 
          borderRadius: 2, 
          height: 'fit-content',
          maxHeight: { xs: '50vh', lg: '80vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mt: { xs: 2, lg: 0 }
        }}
      >
        {/* Day Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Event />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {format(selectedDate, 'EEEE')} • {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Events List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List sx={{ p: 0 }}>
            {dayEvents.length === 0 ? (
              <ListItem sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No events scheduled for this day
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    Click on the calendar to add a new event
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              dayEvents.map((event, index) => (
                <React.Fragment key={`${event.id}-${index}`}>
                  <ListItem
                    button
                    onClick={() => onEventClick(event)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      borderLeft: 4,
                      borderLeftColor: event.color || categoryColors[event.category] || 'primary.main',
                      cursor: 'pointer',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 2,
                      px: 2
                    }}
                  >
                    {/* Event Title */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, width: '100%' }}>
                      {event.title}
                    </Typography>

                    {/* Event Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(parseISO(event.datetime), 'h:mm a')}
                      </Typography>
                    </Box>

                    {/* Event Description */}
                    {event.description && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1, width: '100%' }}>
                        <Description sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                          {event.description}
                        </Typography>
                      </Box>
                    )}

                    {/* Event Category */}
                    {event.category && (
                      <Chip 
                        label={event.category} 
                        size="small" 
                        sx={{ 
                          height: 24, 
                          fontSize: '0.75rem',
                          backgroundColor: categoryColors[event.category] || '#1976d2',
                          color: 'white',
                          mt: 0.5
                        }}
                      />
                    )}

                    {/* Recurrence indicator */}
                    {event.recurrence && event.recurrence.type !== 'none' && (
                      <Typography variant="caption" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
                        🔄 Recurring ({event.recurrence.type})
                      </Typography>
                    )}
                  </ListItem>
                  {index < dayEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Box>

        {/* Quick Add Button */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Click on any event to edit • Double-click calendar to add new event
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default DayView;