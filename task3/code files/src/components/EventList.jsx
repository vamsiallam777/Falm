import React from 'react';
import { format, parseISO, isSameMonth } from 'date-fns';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  Divider
} from '@mui/material';
import {
  Event,
  Schedule
} from '@mui/icons-material';

const EventList = ({ events, onEventClick, currentDate }) => {
  // Filter events for current month and sort by date/time
  const monthEvents = events
    .filter(event => isSameMonth(parseISO(event.date), currentDate))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const upcomingEvents = events
    .filter(event => new Date(event.datetime) >= new Date())
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(0, 5);

  return (
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
      {/* This Month Section */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Event />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            This Month ({monthEvents.length})
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {monthEvents.length === 0 ? (
            <ListItem>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
                No events this month
              </Typography>
            </ListItem>
          ) : (
            monthEvents.map((event, index) => (
              <React.Fragment key={`${event.id}-${index}`}>
                <ListItem
                  button
                  onClick={() => onEventClick(event)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderLeft: 4,
                    borderLeftColor: event.color || 'primary.main',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1.5
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {format(parseISO(event.date), 'MMM d')} at {format(parseISO(event.datetime), 'HH:mm')}
                  </Typography>
                  {event.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      {event.description}
                    </Typography>
                  )}
                  {event.category && (
                    <Chip 
                      label={event.category} 
                      size="small" 
                      sx={{ height: 20, fontSize: '0.7rem' }}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </ListItem>
                {index < monthEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Box>

      <Divider />

      {/* Upcoming Events Section */}
      <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upcoming Events
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {upcomingEvents.length === 0 ? (
            <ListItem>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
                No upcoming events
              </Typography>
            </ListItem>
          ) : (
            upcomingEvents.map((event, index) => (
              <React.Fragment key={`upcoming-${event.id}-${index}`}>
                <ListItem
                  button
                  onClick={() => onEventClick(event)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderLeft: 4,
                    borderLeftColor: event.color || 'secondary.main',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1.5
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {format(parseISO(event.date), 'MMM d, yyyy')} at {format(parseISO(event.datetime), 'HH:mm')}
                  </Typography>
                  {event.category && (
                    <Chip 
                      label={event.category} 
                      size="small" 
                      sx={{ height: 20, fontSize: '0.7rem' }}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </ListItem>
                {index < upcomingEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default EventList;