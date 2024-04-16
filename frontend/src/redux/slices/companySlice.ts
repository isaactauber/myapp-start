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
import { Company } from "../../../types";

interface CompanyState {
  loading: boolean;
  error: string | null;
  currentUserCompanies: Company[] | null;
}

const initialState: CompanyState = {
  loading: false,
  error: null,
  currentUserCompanies: null,
};

interface CreateCompanyReturnType {
  companyId: string;
}

interface CreateCompanyArgs {
  description: string;
  companyName: string;
  companyType: string;
}

export const createCompany = createAsyncThunk<CreateCompanyReturnType, CreateCompanyArgs>(
  "company/create",
  async ({ description, companyName, companyType }, { rejectWithValue }) => {
    try {
      if (!FIREBASE_AUTH.currentUser) {
        throw new Error("User not authenticated");
      }

      const docRef = await addDoc(collection(FIREBASE_DB, "company"), {
        creator: FIREBASE_AUTH.currentUser.uid,
        description,
        companyName,
        companyType,
        creation: serverTimestamp(),
      });

      return { companyId: docRef.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanyByUser = createAsyncThunk(
  "company/getCompanyByUser",
  async (uid: string, { dispatch, rejectWithValue }) => {
    try {
      // Create a query against the collection.
      const q = query(
        collection(FIREBASE_DB, "company"),
        where("creator", "==", uid),
        orderBy("creation", "desc"),
      );

      const querySnapshot = await getDocs(q);

      // Map over the snapshot to get the array of company
      const companies = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data } as Company;
      });
      // Dispatch action to update the state. Replace `CURRENT_USER_COMPANIES_UPDATE` with the actual action creator
      dispatch({ type: "CURRENT_USER_COMPANIES_UPDATE", payload: companies });

      return companies; // Return companies as fulfilled payload
    } catch (error) {
      console.error("Failed to get companies: ", error);
      return rejectWithValue(error);
    }
  },
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getCompanyByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCompanyByUser.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.loading = false;
          state.currentUserCompanies = action.payload;
        },
      )
      .addCase(getCompanyByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default companySlice.reducer;
