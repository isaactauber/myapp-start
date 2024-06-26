import { ScrollView } from "react-native";
import styles from "./styles";
import ProfileNavBar from "../../components/profile/navBar";
import ProfileHeader from "../../components/profile/header";
import ProfilePostList from "../../components/profile/postList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { CurrentUserProfileItemInViewContext, FeedStackParamList } from "../../navigation/feed";
import { useUser } from "../../hooks/useUser";
import { getPostsByHostId } from "../../services/posts";
import { Host, Post } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../feed";
import EditProfileScreen from "./edit";
import EditProfileFieldScreen from "./edit/field";
import { HostViewStackParamList } from "../../navigation/host";
import { getHostById } from "../../services/host";

export type ProfileStackParamList = {
  userPosts: { creator: string; profile: boolean };
  editProfile: undefined;
  editProfileField: { title: string; field: string; value: string };
  profileHome: { hostId: string };
  // TODO: is this working?
  profileOther: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

type ProfileScreenRouteProp = RouteProp<HostViewStackParamList, "profile">;

export default function ProfileScreen({ route }: { route: ProfileScreenRouteProp }) {
  const hostId = route.params.currentHost;
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [host, setHost] = useState<Host | null>(null);

  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  useEffect(() => {
    const fetchHostData = async () => {
      const fetchedHost = await getHostById(hostId);
      setHost(fetchedHost);
    };

    const fetchPosts = async () => {
      const posts = await getPostsByHostId(hostId);
      setUserPosts(posts);
    };

    fetchHostData();
    fetchPosts();
  }, [hostId]);

  const ProfileHome = () => {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileNavBar host={host} />
        <ScrollView>
          <ProfileHeader host={host} />
          <ProfilePostList posts={userPosts} />
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <Stack.Navigator initialRouteName="profileHome">
      <Stack.Screen
        name="userPosts"
        component={FeedScreen}
        options={{ headerShown: false }}
        initialParams={{ profile: true }}
      />
      <Stack.Screen
        name="editProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editProfileField"
        component={EditProfileFieldScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profileHome"
        component={ProfileHome}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
