import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Event } from "../../../types";

interface EventState {
  loading: boolean;
  error: string | null;
  currentHostEvents: Event[] | null;
}

const initialState: EventState = {
  loading: false,
  error: null,
  currentHostEvents: null,
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
}

export const createEvent = createAsyncThunk<CreateEventReturnType, CreateEventArgs>(
  "event/create",
  async ({ creatorHost, description, eventName, dateTimes, eventType, location }, { rejectWithValue }) => {
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
      });
  },
});

export default eventSlice.reducer;
