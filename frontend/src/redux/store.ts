import { configureStore, Action, ThunkDispatch } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import postSlice from "./slices/postSlice";
import modalSlice from "./slices/modalSlice";
import chatSlice from "./slices/chatSlice";
import hostSlice from "./slices/hostSlice";
import eventSlice from "./slices/eventSlice";
import ticketSlice from "./slices/ticketSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    post: postSlice,
    host: hostSlice,
    event: eventSlice,
    modal: modalSlice,
    chat: chatSlice,
    ticket: ticketSlice,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = ThunkDispatch<RootState, null, Action<string>>;
export type RootState = ReturnType<typeof store.getState>;
