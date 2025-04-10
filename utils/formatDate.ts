import moment from 'moment';
import { Timestamp } from 'firebase/firestore';

const formatDate = (dateInput: string | Timestamp | Date | null): string => {
  try {
    // Handle null/undefined
    if (!dateInput) return 'No date';
    
    // Convert to moment object
    let dateMoment: moment.Moment;
    
    if (dateInput instanceof Timestamp) {
      dateMoment = moment(dateInput.toDate());
    } else if (dateInput instanceof Date) {
      dateMoment = moment(dateInput);
    } else if (typeof dateInput === 'string') {
      dateMoment = moment(new Date(dateInput));
    } else {
      return 'Invalid date format';
    }

    // Validate the date
    if (!dateMoment.isValid()) return 'Invalid date';

    const now = moment();
    
    // Compare dates
    if (dateMoment.isSame(now, 'year')) {
      if (dateMoment.isSame(now, 'day')) return `Today, ${dateMoment.format('h:mm A')}`;
      if (dateMoment.isSame(now.clone().subtract(1, 'day'), 'day')) return `Yesterday, ${dateMoment.format('h:mm A')}`;
      if (dateMoment.isSame(now, 'week')) return `${dateMoment.format('dddd')}, ${dateMoment.format('h:mm A')}`;
      return dateMoment.format('MMMM D, h:mm A');
    }
    return dateMoment.format('MMMM D, YYYY, h:mm A');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export default formatDate;