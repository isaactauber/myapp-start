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
  currentUserEvents: Event[] | null;
}

const initialState: EventState = {
  loading: false,
  error: null,
  currentUserEvents: null,
};

interface CreateEventReturnType {
  eventId: string;
}

interface CreateEventArgs {
  eventCompany: string;
  description: string;
  eventName: string;
  dateTimes: Date[];
  eventType: string;
  location: string;
}

export const createEvent = createAsyncThunk<CreateEventReturnType, CreateEventArgs>(
  "event/create",
  async ({ eventCompany, description, eventName, dateTimes, eventType, location }, { rejectWithValue }) => {
    try {
      if (!FIREBASE_AUTH.currentUser) {
        throw new Error("User not authenticated");
      }

      const docRef = await addDoc(collection(FIREBASE_DB, "event"), {
        creator: FIREBASE_AUTH.currentUser.uid,
        eventCompany,
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

export const getEventsByUser = createAsyncThunk(
  "event/getEventsByUser",
  async (uid: string, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "event"),
        where("creator", "==", uid),
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
      .addCase(getEventsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventsByUser.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.currentUserEvents = action.payload;
        },
      )
      .addCase(getEventsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default eventSlice.reducer;
