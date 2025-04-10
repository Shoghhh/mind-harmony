import { Timestamp } from 'firebase/firestore';

export function parseFirestoreDate(date: Timestamp | string): Date {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return new Date(date);
}