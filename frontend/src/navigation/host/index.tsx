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

// TODO: cache currentHost parameter with FIREBASE_AUTH instead of passing around as screen params
export type HostViewStackParamList = {
  home: { currentHost: string };
  search: { currentHost: string };
  create: { currentHost: string };
  myTickets: { initialUserId: string; currentHost: string };
  profile: { currentHost: string };
  hostPosts: { creator: string; profile: boolean; currentHost: string };
}

const Tab = createMaterialBottomTabNavigator<HostViewStackParamList>();

interface HostViewScreenProps {
  route: 
    | RouteProp<MainStackParamList, "hostView">;
}

export default function HostViewScreen({ route }: HostViewScreenProps) {
  useChats();
  const currentHost = route.params.hostId;

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: "black", height: 114 }}
      initialRouteName="home"
    >
      <Tab.Screen
        name="home"
        component={HostHomeScreen}
        initialParams={{ currentHost: currentHost }}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        initialParams={{ currentHost: currentHost }}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="create"
        component={CameraScreen}
        initialParams={{ currentHost: currentHost }}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="myTickets"
        component={GuestlistScreen}
        initialParams={{ currentHost: currentHost }}
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
        initialParams={{ currentHost: currentHost }}
      />
    </Tab.Navigator>
  );
}
