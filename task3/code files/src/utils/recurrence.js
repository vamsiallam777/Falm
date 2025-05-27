import { addDays, addWeeks, addMonths, parseISO, isValid } from 'date-fns';

export const generateRecurringEvents = (baseEvent, startDate, endDate) => {
  const events = [];
  const recurrence = baseEvent.recurrence;
  
  if (!recurrence || recurrence.type === 'none') {
    return [baseEvent];
  }

  let currentDate = parseISO(baseEvent.date);
  
  // Validate the parsed date
  if (!isValid(currentDate)) {
    console.error('Invalid date in event:', baseEvent.date);
    return [baseEvent];
  }

  const endRecurrence = recurrence.endDate ? parseISO(recurrence.endDate) : endDate;

  // Ensure we don't generate events beyond the view range or end date
  while (currentDate <= endRecurrence && currentDate <= endDate) {
    if (currentDate >= startDate) {
      const recurringEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-${currentDate.getTime()}`,
        date: currentDate.toISOString().split('T')[0],
        datetime: `${currentDate.toISOString().split('T')[0]}T${baseEvent.datetime.split('T')[1]}`
      };
      events.push(recurringEvent);
    }

    // Calculate next occurrence
    switch (recurrence.type) {
      case 'daily':
        currentDate = addDays(currentDate, recurrence.interval || 1);
        break;
      case 'weekly':
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          // Find next day of week
          let nextDate = addDays(currentDate, 1);
          let attempts = 0;
          while (!recurrence.daysOfWeek.includes(nextDate.getDay()) && attempts < 7) {
            nextDate = addDays(nextDate, 1);
            attempts++;
          }
          currentDate = nextDate;
        } else {
          currentDate = addWeeks(currentDate, recurrence.interval || 1);
        }
        break;      case 'monthly': {
        const nextMonth = addMonths(currentDate, 1);
        const dayOfMonth = recurrence.dayOfMonth || recurrence.interval || currentDate.getDate();
        
        // Handle months with fewer days (e.g., Feb 30th becomes Feb 28th)
        const daysInNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
        const adjustedDay = Math.min(dayOfMonth, daysInNextMonth);
        
        currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), adjustedDay);
        break;
      }
      case 'custom':
        currentDate = addDays(currentDate, recurrence.interval || 1);
        break;
      default:
        return [baseEvent];
    }

    // Safety check to prevent infinite loops
    if (events.length > 100) {
      break;
    }
  }

  return events.length > 0 ? events : [baseEvent];
};

export const getRecurrenceDescription = (recurrence) => {
  if (!recurrence || recurrence.type === 'none') {
    return 'No recurrence';
  }

  const interval = recurrence.interval || 1;
  const pluralize = (word, count) => count === 1 ? word : word + 's';

  switch (recurrence.type) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} ${pluralize('day', interval)}`;
    case 'weekly':
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const selectedDays = recurrence.daysOfWeek
          .sort((a, b) => a - b)
          .map(day => days[day - 1])
          .join(', ');
        return `Weekly on ${selectedDays}`;
      }
      return interval === 1 ? 'Weekly' : `Every ${interval} ${pluralize('week', interval)}`;
    case 'monthly':
      return interval === 1 ? 'Monthly' : `Every ${interval} ${pluralize('month', interval)}`;
    case 'custom':
      return `Every ${interval} ${pluralize('day', interval)} (custom)`;
    default:
      return 'Custom recurrence';
  }
};