import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { Ticket, Event } from "../../../types";
import { getEventById } from "./eventSlice"; // Import the getEventById function

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
};

interface CreateTicketArgs {
  userId: string;
  eventId: string;
}

export const createTicket = createAsyncThunk<Ticket, CreateTicketArgs>(
  "ticket/create",
  async ({ userId, eventId }, { dispatch, rejectWithValue }) => {
    try {
      // Fetch the event details to get the event name
      const eventResult = await dispatch(getEventById(eventId));

      if (getEventById.fulfilled.match(eventResult)) {
        const event = eventResult.payload as Event;

        // Generate unique ticket ID
        const uniqueEventId = `${eventId}_${userId}_${Date.now().toString()}`;

        // Generate QR code data
        const qrCodeData = JSON.stringify({
          eventId,
          userId,
          uniqueEventId,
          timestamp: new Date(),
        });

        // Create a new ticket
        const newTicket: Ticket = {
          id: `${eventId}_${userId}_${uniqueEventId}`,
          eventId,
          eventName: event.eventName, // Populate event name
          userID: userId,
          uniqueEventId,
          timestamp: new Date(),
          qrCodeData,
        };

        // Commit the Ticket object to the database
        await addDoc(collection(FIREBASE_DB, "tickets"), newTicket);

        return newTicket;
      } else {
        throw new Error("Failed to fetch event details");
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTicketsByUser = createAsyncThunk<Ticket[], string>(
  "ticket/getTicketsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      // Create a query to get tickets by user ID
      const q = query(
        collection(FIREBASE_DB, "tickets"),
        where("userID", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of tickets
      const tickets = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Ticket;
      });

      return tickets;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getTicketsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTicketsByUser.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.loading = false;
          state.tickets = action.payload;
        },
      )
      .addCase(getTicketsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default ticketSlice.reducer;
