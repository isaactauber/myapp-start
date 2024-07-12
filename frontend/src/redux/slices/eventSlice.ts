import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Event } from "../../../types";

interface EventState {
  events: any;
  loading: boolean;
  error: string | null;
  currentHostEvents: Event[] | null;
}

const initialState: EventState = {
  loading: false,
  error: null,
  currentHostEvents: null,
  events: [],
};

interface CreateEventReturnType {
  eventId: string;
}

interface CreateEventArgs {
  creatorHost: string;
  description: string;
  eventName: string;
  dateTimes: Date[];
  eventType: string;
  location: string;
  availableTickets: number;
}

export const createEvent = createAsyncThunk<CreateEventReturnType, CreateEventArgs>(
  "event/create",
  async ({ creatorHost, description, eventName, dateTimes, eventType, location, availableTickets }, { rejectWithValue }) => {
    try {
      if (!FIREBASE_AUTH.currentUser) {
        throw new Error("User not authenticated");
      }
      const docRef = await addDoc(collection(FIREBASE_DB, "event"), {
        creatorUser: FIREBASE_AUTH.currentUser.uid,
        creatorHost,
        description,
        eventName,
        dateTimes,
        eventType,
        location,
        availableTickets,
        guestList: [],
        creation: serverTimestamp(),
      });
      return { eventId: docRef.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getEventsByHost = createAsyncThunk(
  "event/getEventsByHost",
  async (uid: string, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "event"),
        where("creatorHost", "==", uid),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of events
      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Event;
      });
      // Dispatch action to update the state. Replace `CURRENT_USER_EVENTS_UPDATE` with the actual action creator
      dispatch({ type: "CURRENT_USER_EVENTS_UPDATE", payload: events });

      return events; // Return events as fulfilled payload
    } catch (error) {
      console.error("Failed to get events: ", error);
      return rejectWithValue(error);
    }
  },
);

export const getAllEvents = createAsyncThunk(
  "event/getAllEvents",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "event"),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of events
      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Event;
      });
      // Dispatch action to update the state. Replace `All_EVENTS_UPDATE` with the actual action creator
      dispatch({ type: "All_EVENTS_UPDATE", payload: events });

      return events; // Return events as fulfilled payload
    } catch (error) {
      console.error("Failed to get events: ", error);
      return rejectWithValue(error);
    }
  },
);

export const getAvailableTicketsByEvent = createAsyncThunk(
  "event/getAvailableTicketsByEvent",
  async (eventId: string, { rejectWithValue }) => {
    try {
      // Create a reference to the event document
      const eventDocRef = doc(FIREBASE_DB, "event", eventId);

      // Fetch the document
      const eventDocSnapshot = await getDoc(eventDocRef);

      if (!eventDocSnapshot.exists()) {
        throw new Error("Event not found");
      }

      // Extract the availableTickets field from the document data
      const eventData = eventDocSnapshot.data();
      const availableTickets = eventData?.availableTickets;

      if (availableTickets === undefined) {
        throw new Error("availableTickets field not found in the event document");
      }

      return availableTickets; // Return availableTickets as fulfilled payload
    } catch (error) {
      console.error("Failed to get available tickets: ", error);
      return rejectWithValue(error);
    }
  }
);

export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (eventId: string, { rejectWithValue }) => {
    try {
      // Create a reference to the event document
      const eventDocRef = doc(FIREBASE_DB, "event", eventId);

      // Fetch the document
      const eventDocSnapshot = await getDoc(eventDocRef);

      if (!eventDocSnapshot.exists()) {
        throw new Error("Event not found");
      }

      // Extract the event data from the document
      const eventData = eventDocSnapshot.data() as Event;

      return { event: eventDocSnapshot.id, ...eventData }; // Return event as fulfilled payload
    } catch (error) {
      console.error("Failed to get event: ", error);
      return rejectWithValue(error);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getEventsByHost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventsByHost.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.currentHostEvents = action.payload;
        },
      )
      .addCase(getEventsByHost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.events = action.payload;
        },
      )
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getAvailableTicketsByEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAvailableTicketsByEvent.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.error = null;
          // Handle the available tickets data if necessary
        },
      )
      .addCase(getAvailableTicketsByEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventById.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          state.events = [action.payload]; // Optionally update the state with the fetched event
        },
      )
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default eventSlice.reducer;
