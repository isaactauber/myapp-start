import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ProfileScreen from "../../screens/profile";
import SearchScreen from "../../screens/search";
import FeedNavigation from "../feed";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useChats } from "../../hooks/useChats";
import SwitchViewScreen from "../../screens/switchView";
import MyTicketsScreen from "../../screens/myTickets";
import UserProfileScreen from "../../screens/userProfile";

export type UserViewStackParamList = {
  feed: undefined;
  search: undefined;
  create: { hostId: string };
  myTickets: { initialUserId: string };
  profile: { initialUserId: string };
}

// export type HomeStackParamList = {
//   feed: undefined;
//   Discover: undefined;
//   Add: undefined;
//   Inbox: undefined;
//   Me: { initialUserId: string };
// };

const Tab = createMaterialBottomTabNavigator<UserViewStackParamList>();

export default function UserViewScreen() {
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
        component={SwitchViewScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="myTickets"
        component={MyTicketsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={UserProfileScreen}
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
