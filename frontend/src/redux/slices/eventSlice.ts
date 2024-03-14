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
import { saveMediaToStorage } from "../../services/utils";
import uuid from "uuid-random";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Event } from "../../../types";
import dayjs from 'dayjs';

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

export const createEvent = createAsyncThunk(
  "event/create",
  async (
    {
        description,
        eventName,
        date,
    }: {
      description: string;
      eventName: string;
      date: Date;
    },
    { rejectWithValue },
  ) => {
    if (FIREBASE_AUTH.currentUser) {
      try {
        const storageEventId = uuid();

        await addDoc(collection(FIREBASE_DB, "event"), {
          creator: FIREBASE_AUTH.currentUser.uid,
          description,
          eventName,
          date,

          creation: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error creating event: ", error);
        return rejectWithValue(error);
      }
    } else {
      return rejectWithValue(new Error("User not authenticated"));
    }
  },
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
