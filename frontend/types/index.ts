export interface Post {
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
  name: string;
  eventType: string;
  dateTimes: Date[];
  description: string;
  location: string;
  creation: string;
}

export interface Host {
  id: string;
  creator: string;
  hostName: string;
  hostType: string;
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
