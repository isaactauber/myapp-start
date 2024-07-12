export interface Post {
  description: string;
  id: string;
  creatorUser: string;
  creatorHost: string;
  media: string[];
  event: Event;
  likesCount: number;
  commentsCount: number;
  creation: string;
}

export interface Event {
  id: string;
  creatorUser: string;
  creatorHost: string;
  eventName: string;
  eventType: string;
  dateTimes: Date[];
  description: string;
  location: string;
  creation: string;
  guestList: string[];
  availableTickets: number;
  //TODO `maxTicketsPerPerson: number
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  userID: string;
  uniqueEventId: string;
  timestamp: Date;
  qrCodeData: string;
}

export interface Host {
  id: string;
  creator: string;
  hostName: string;
  hostType: string;
  description: string;
  creation: string;
  displayName: string | null;
  photoURL?: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
}

export interface Comment {
  id: string;
  creator: string;
  comment: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
}

export interface SearchUser extends User {
  id: string;
}

export interface Chat {
  id: string;
  members: string[];
  lastMessage: string;
  lastUpdate?: {
    seconds?: number;
    nanoseconds?: number;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  creator: string;
  message: string;
}
