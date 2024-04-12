import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuthStateListener } from "../../redux/slices/authSlice";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../../screens/auth";
import { AppDispatch, RootState } from "../../redux/store";
import HomeScreen from "../home";
import { View } from "react-native";
import Modal from "../../components/modal";
import SaveEventDetailsScreen from "../../screens/saveEvent";
import SaveEventDateTime from "../../screens/saveEventDateTime";

// TODO split this up
export type RootStackParamList = {
  home: undefined;
  auth: undefined;
  userPosts: { creator: string; profile: boolean };
  profileOther: { initialUserId: string };
  savePost: { source: string; sourceThumb: string };
  saveEventDetails: { source: string; sourceThumb: string };
  saveEventDateTime: { 
    source: string;
    sourceThumb: string;
    name: string;
    description: string;
    eventType: string;
    location: string;
    dateTimes: Date[];
  };
  editProfile: undefined;
  editProfileField: { title: string; field: string; value: string };
  createHostingCompany: undefined;
  chatSingle: { chatId?: string; contactId?: string };
  profileHome: { initialUserId: string };
  cameraHome: undefined;
  chatHome: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Route() {
  const currentUserObj = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(userAuthStateListener());
  }, [dispatch]);

  if (!currentUserObj.loaded) {
    return <View></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUserObj.currentUser == null ? (
          <Stack.Screen
            name="auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            {/* CameraScreen did not work well being nested in a Screen.Navigator, 
              keeping saveEvent screens here for now */}
            <Stack.Screen
              name="saveEventDetails"
              component={SaveEventDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="saveEventDateTime"
              component={SaveEventDateTime}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
      <Modal />
    </NavigationContainer>
  );
}
