import { Timestamp } from "firebase/firestore";
import moment from "moment";

const formatTodoDate = (timestamp: Timestamp | Date | string | null): string => {
    try {
      if (!timestamp) return 'No date';
      
      if (timestamp instanceof Timestamp) {
        return moment(timestamp.toDate()).format('MMMM Do YYYY, h:mm a');
      }
      
      if (timestamp instanceof Date) {
        return moment(timestamp).format('MMMM Do YYYY, h:mm a');
      }
      
      if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return moment(date).format('MMMM Do YYYY, h:mm a');
        }
      }
      
      return 'Invalid date format';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
};

export default formatTodoDate