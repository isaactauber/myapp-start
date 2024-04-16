export interface Post {
  id: string;
  creator: string;
  media: string[];
  event: Event;
  likesCount: number;
  commentsCount: number;
  creation: string;
}

export interface Event {
  id: string;
  creator: string;
  name: string;
  eventType: string;
  dateTimes: Date[];
  description: string;
  location: string;
  creation: string;
}

export interface Company {
  id: string;
  creator: string;
  companyName: string;
  companyType: string;
  description: string;
  creation: string;
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
