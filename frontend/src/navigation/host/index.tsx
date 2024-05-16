import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ProfileScreen from "../../screens/profile";
import SearchScreen from "../../screens/search";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useChats } from "../../hooks/useChats";
import CameraScreen from "../../screens/camera";
import GuestlistScreen from "../../screens/guestList";
import HostHomeScreen from "../../screens/hostHome";

export type HostViewStackParamList = {
  home: undefined;
  search: undefined;
  create: { hostId: string };
  myTickets: { initialUserId: string };
  profile: { initialUserId: string };
  hostPosts: { creator: string; profile: boolean };
}

// export type HomeStackParamList = {
//   feed: undefined;
//   Discover: undefined;
//   Add: undefined;
//   Inbox: undefined;
//   Me: { initialUserId: string };
// };

const Tab = createMaterialBottomTabNavigator<HostViewStackParamList>();

export default function HostViewScreen() {
  useChats();

  return (
    <Tab.Navigator
      // TODO: height not set and dynamically calculated in useMaterialNavBarHeight.ts
      barStyle={{ backgroundColor: "black", height: 114 }}
      initialRouteName="home"
    >
      <Tab.Screen
        name="home"
        component={HostHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="create"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="myTickets"
        component={GuestlistScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
        initialParams={{ initialUserId: FIREBASE_AUTH.currentUser?.uid ?? "" }}
      />
    </Tab.Navigator>
  );
}
