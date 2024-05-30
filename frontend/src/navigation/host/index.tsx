import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ProfileScreen from "../../screens/profile";
import SearchScreen from "../../screens/search";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useChats } from "../../hooks/useChats";
import CameraScreen from "../../screens/camera";
import GuestlistScreen from "../../screens/guestList";
import HostHomeScreen from "../../screens/hostHome";
import { MainStackParamList } from "../main";
import { RouteProp } from "@react-navigation/native";

export type HostViewStackParamList = {
  home: undefined;
  search: undefined;
  create: { hostId: string };
  myTickets: { initialUserId: string };
  profile: { initialUserId: string };
  hostPosts: { creator: string; profile: boolean };
  createHost: undefined;
}

const Tab = createMaterialBottomTabNavigator<HostViewStackParamList>();

interface HostViewScreenProps {
  route: 
    | RouteProp<MainStackParamList, "hostView">;
}

export default function HostViewScreen({ route }: HostViewScreenProps) {
  useChats();
  const hostId = route.params.hostId;
  const userId = route.params.userId;

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
