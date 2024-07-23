import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { Ticket } from "../../../types";

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
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      // Fetch the event data
      const eventDocRef = doc(FIREBASE_DB, "event", eventId);
      const eventDocSnapshot = await getDoc(eventDocRef);
      if (!eventDocSnapshot.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventDocSnapshot.data();
      const eventName = eventData?.eventName || "Unknown Event";

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
      const docRef = await addDoc(collection(FIREBASE_DB, "ticket"), {
        eventId,
        eventName, // Use fetched event name
        userID: userId,
        uniqueEventId,
        timestamp: new Date(),
        qrCodeData,
        isScanned: false,
      });

      const newTicket: Ticket = {
        uid: docRef.id,
        eventId,
        eventName,
        userID: userId,
        uniqueEventId,
        timestamp: new Date(),
        qrCodeData,
        isScanned: false,
      };

      return newTicket;
    } catch (error) {
      console.error("Failed to create ticket: ", error);
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
        collection(FIREBASE_DB, "ticket"),
        where("userID", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of tickets
      const tickets = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data
        } as Ticket;
      });

      return tickets;
    } catch (error) {
      console.error("Failed to get tickets by user: ", error);
      return rejectWithValue(error);
    }
  }
);

export const getTicketsByEventId = createAsyncThunk<Ticket[], string>(
  "ticket/getTicketsByEventId",
  async (eventId, { rejectWithValue }) => {
    try {
      // Create a query to get tickets by event ID
      const q = query(
        collection(FIREBASE_DB, "ticket"),
        where("eventId", "==", eventId)
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of tickets
      const tickets = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data
        } as Ticket;
      });

      return tickets;
    } catch (error) {
      console.error("Failed to get tickets by event ID: ", error);
      return rejectWithValue(error);
    }
  }
);

export const updateTicketScannedStatus = createAsyncThunk<{ ticketId: string; isScanned: boolean }, { ticketId: string; isScanned: boolean }>(
  "ticket/updateTicketScannedStatus",
  async ({ ticketId, isScanned }, { rejectWithValue }) => {
    try {
      const ticketDocRef = doc(FIREBASE_DB, "ticket", ticketId);
      await updateDoc(ticketDocRef, { isScanned });
      return { ticketId, isScanned };
    } catch (error) {
      console.error("Failed to update ticket scanned status: ", error);
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
      .addCase(createTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.loading = false;
        state.error = null;
        state.tickets.push(action.payload);
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
      })
      .addCase(getTicketsByEventId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTicketsByEventId.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.loading = false;
          state.tickets = action.payload;
        },
      )
      .addCase(getTicketsByEventId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateTicketScannedStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketScannedStatus.fulfilled, (state, action: PayloadAction<{ ticketId: string; isScanned: boolean }>) => {
        state.loading = false;
        state.error = null;
        const { ticketId, isScanned } = action.payload;
        const ticket = state.tickets.find(ticket => ticket.uid === ticketId);
        if (ticket) {
          ticket.isScanned = isScanned;
        }
      })
      .addCase(updateTicketScannedStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default ticketSlice.reducer;
