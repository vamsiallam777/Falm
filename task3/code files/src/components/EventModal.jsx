import React, { useState, useEffect, useCallback } from 'react';
import { format, isSameDay } from 'date-fns';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close,
  Delete,
  Save,
  Warning,
  Event,
  Description,
  Category,
  Palette,
  Repeat
} from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const EventModal = ({ selectedDate, event, onSave, onDelete, onClose, existingEvents = [] }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(new Date());
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [recurrenceType, setRecurrenceType] = useState('none');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setDate(new Date(event.date));
      setTime(new Date(event.datetime));
      setCategory(event.category || '');
      setColor(event.color || '#1976d2');
      
      if (event.recurrence) {
        setRecurrenceType(event.recurrence.type || 'none');
        setRecurrenceInterval(event.recurrence.interval || 1);
        setRecurrenceEndDate(event.recurrence.endDate ? new Date(event.recurrence.endDate) : null);
        setDaysOfWeek(event.recurrence.daysOfWeek || []);
      }
    } else {
      // Reset form for new event
      setTitle('');
      setDescription('');
      setDate(selectedDate);
      setTime(new Date());
      setCategory('');
      setColor('#1976d2');
      setRecurrenceType('none');
      // Set interval to the selected date's day for monthly recurrence
      setRecurrenceInterval(selectedDate ? selectedDate.getDate() : 1);
      setRecurrenceEndDate(null);
      setDaysOfWeek([]);
    }
  }, [event, selectedDate]);
  // Check for time conflicts
  const checkConflicts = useCallback(() => {
    if (!date || !time) return;

    try {
      const eventDateTime = new Date(date);
      eventDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
      
      const conflictingEvents = existingEvents.filter(existingEvent => {
        if (event && existingEvent.id === event.id) return false;
        
        try {
          const existingDateTime = new Date(existingEvent.datetime);
          return isSameDay(eventDateTime, existingDateTime) && 
                 Math.abs(eventDateTime.getTime() - existingDateTime.getTime()) < 60 * 60 * 1000;
        } catch (error) {
          console.error('Error parsing existing event datetime:', existingEvent.datetime, error);
          return false;
        }
      });

      setConflicts(conflictingEvents);
    } catch (error) {
      console.error('Error in conflict checking:', error);
      setConflicts([]);
    }
  }, [date, time, existingEvents, event]);

  useEffect(() => {
    checkConflicts();
  }, [checkConflicts]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (conflicts.length > 0) {
      const proceed = window.confirm(
        `This event conflicts with: ${conflicts.map(c => c.title).join(', ')}. Continue anyway?`
      );
      if (!proceed) return;
    }    const eventData = {
      title: title.trim(),
      description: description.trim(),
      date: format(date, 'yyyy-MM-dd'),
      datetime: `${format(date, 'yyyy-MM-dd')}T${format(time, 'HH:mm')}`,
      category: category || 'Other',
      color,
      recurrence: recurrenceType === 'none' ? null : {
        type: recurrenceType,
        interval: parseInt(recurrenceInterval) || 1,
        endDate: recurrenceEndDate ? format(recurrenceEndDate, 'yyyy-MM-dd') : null,
        daysOfWeek: recurrenceType === 'weekly' && daysOfWeek.length > 0 ? daysOfWeek : null,
        dayOfMonth: recurrenceType === 'monthly' ? parseInt(recurrenceInterval) || 1 : null
      }
    };

    console.log('Saving event with recurrence:', eventData); // Debug log
    
    if (onSave) {
      onSave(eventData);
    }
  };

  const categories = ['Work', 'Personal', 'Health', 'Social', 'Travel', 'Other'];
  const colors = ['#1976d2', '#d32f2f', '#2e7d32', '#ed6c02', '#7b1fa2', '#0288d1'];

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Event color="primary" />
          <Typography variant="h6" component="div">
            {event ? 'Edit Event' : 'Add New Event'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      {conflicts.length > 0 && (
        <Alert severity="warning" sx={{ mx: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            Time conflict with: {conflicts.map(c => c.title).join(', ')}
          </Box>
        </Alert>
      )}

      <DialogContent sx={{ pb: 2 }}>
        <Grid container spacing={3}>          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter event title..."
            />
          </Grid><Grid item xs={12} sm={6}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
                // Auto-update monthly recurrence interval when date changes
                if (recurrenceType === 'monthly' && newDate) {
                  setRecurrenceInterval(newDate.getDate());
                }
              }}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Time"
              value={time}
              onChange={setTime}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                startAdornment: <Description sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                startAdornment={<Category sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette color="action" />
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colors.map(colorOption => (
                  <Box
                    key={colorOption}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: colorOption,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: color === colorOption ? '3px solid #000' : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setColor(colorOption)}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Repeat color="action" />
              Recurrence
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Recurrence Type</InputLabel>
              <Select
                value={recurrenceType}
                label="Recurrence Type"
                onChange={(e) => setRecurrenceType(e.target.value)}
              >
                <MenuItem value="none">No Recurrence</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>            {recurrenceType === 'weekly' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Days of Week</Typography>
                <ToggleButtonGroup
                  value={daysOfWeek}
                  onChange={(e, newDays) => setDaysOfWeek(newDays)}
                  aria-label="days of week"
                  size="small"
                >
                  {['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <ToggleButton key={day} value={index} aria-label={day}>
                      {day}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            )}

            {recurrenceType === 'monthly' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Monthly Recurrence Options</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Day of Month (1-31)"
                      type="number"
                      inputProps={{ min: 1, max: 31 }}
                      value={recurrenceInterval}
                      onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                      helperText={`Current: ${recurrenceInterval}${recurrenceInterval === 1 ? 'st' : recurrenceInterval === 2 ? 'nd' : recurrenceInterval === 3 ? 'rd' : 'th'} of each month`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (optional)"
                      value={recurrenceEndDate}
                      onChange={setRecurrenceEndDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {recurrenceType !== 'none' && recurrenceType !== 'monthly' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Repeat every ${recurrenceType === 'daily' ? 'days' : recurrenceType === 'weekly' ? 'weeks' : 'days'}`}
                    type="number"
                    inputProps={{ min: 1 }}
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date (optional)"
                    value={recurrenceEndDate}
                    onChange={setRecurrenceEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
            )}

            {recurrenceType === 'monthly' && (
              <DatePicker
                label="End Date (optional)"
                value={recurrenceEndDate}
                onChange={setRecurrenceEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {event && (
          <Button
            onClick={() => onDelete(event.id)}
            color="error"
            variant="outlined"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          sx={{ minWidth: 120 }}
        >
          {event ? 'Update' : 'Save'} Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;