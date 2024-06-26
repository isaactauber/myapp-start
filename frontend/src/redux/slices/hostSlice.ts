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
import { Host } from "../../../types";

interface HostState {
  loading: boolean;
  error: string | null;
  currentUserHosts: Host[] | null;
}

const initialState: HostState = {
  loading: false,
  error: null,
  currentUserHosts: null,
};

interface CreateHostReturnType {
  hostId: string;
}

interface CreateHostArgs {
  description: string;
  hostName: string;
  hostType: string;
}

export const createHost = createAsyncThunk<CreateHostReturnType, CreateHostArgs>(
  "host/create",
  async ({ description, hostName, hostType }, { rejectWithValue }) => {
    try {
      if (!FIREBASE_AUTH.currentUser) {
        throw new Error("User not authenticated");
      }

      const docRef = await addDoc(collection(FIREBASE_DB, "host"), {
        creator: FIREBASE_AUTH.currentUser.uid,
        description,
        hostName,
        hostType,
        creation: serverTimestamp(),
      });

      return { hostId: docRef.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getHostByUser = createAsyncThunk(
  "host/getHostByUser",
  async (uid: string, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "host"),
        where("creator", "==", uid),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of host
      const hosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Host;
      });
      // Dispatch action to update the state. Replace `CURRENT_USER_COMPANIES_UPDATE` with the actual action creator
      dispatch({ type: "CURRENT_USER_COMPANIES_UPDATE", payload: hosts });

      return hosts; // Return hosts as fulfilled payload
    } catch (error) {
      console.error("Failed to get hosts: ", error);
      return rejectWithValue(error);
    }
  },
);

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createHost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getHostByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getHostByUser.fulfilled,
        (state, action: PayloadAction<Host[]>) => {
          state.loading = false;
          state.currentUserHosts = action.payload;
        },
      )
      .addCase(getHostByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default hostSlice.reducer;
