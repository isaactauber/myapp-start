import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "@expo/vector-icons";
import CameraScreen from "../../screens/camera";
import ProfileScreen from "../../screens/profile";
import SearchScreen from "../../screens/search";
import FeedNavigation from "../feed";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import ChatScreen from "../../screens/chat/list";
import { useChats } from "../../hooks/useChats";
import SaveEventScreen from "../../screens/saveEvent";

export type HomeStackParamList = {
  feed: undefined;
  Discover: undefined;
  AddEvent: undefined;
  Inbox: undefined;
  Me: { initialUserId: string };
};

const Tab = createMaterialBottomTabNavigator<HomeStackParamList>();

export default function HomeScreen() {
  useChats();

  return (
    <Tab.Navigator
      // TODO: height not set and dynamically calculated in useMaterialNavBarHeight.ts
      barStyle={{ backgroundColor: "black", height: 114 }}
      initialRouteName="feed"
    >
      <Tab.Screen
        name="feed"
        component={FeedNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddEvent"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
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
