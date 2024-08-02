import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";

interface User {
  email: string;
  id: string;
  name: string;
}

interface UserState {
  users: Record<string, User>;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: {},
  loading: false,
  error: null,
};

export const getUserDetailsById = createAsyncThunk<User, string>(
  "user/getUserDetailsById",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(FIREBASE_DB, "user"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }

      const userData = querySnapshot.docs[0].data();
      console.log("userData: ", userData.email);
      return { id: userId, email: userData.email, name: userData.displayName };
    } catch (error) {
      console.error("Failed to get user details: ", error);
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users[action.payload.id] = action.payload;
      })
      .addCase(getUserDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
