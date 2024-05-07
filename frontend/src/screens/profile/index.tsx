import { ScrollView } from "react-native";
import styles from "./styles";
import ProfileNavBar from "../../components/profile/navBar";
import ProfileHeader from "../../components/profile/header";
import ProfilePostList from "../../components/profile/postList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import {
  CurrentUserProfileItemInViewContext,
  FeedStackParamList,
} from "../../navigation/feed";
import { useUser } from "../../hooks/useUser";
import { getPostsByUserId } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/main";
import { HomeStackParamList } from "../../navigation/home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../feed";
import EditProfileScreen from "./edit";
import EditProfileFieldScreen from "./edit/field";
import CreateHostingCompanyScreen from "../createHostingCompany";


const Stack = createNativeStackNavigator<RootStackParamList>();

type ProfileScreenRouteProp =
  | RouteProp<RootStackParamList, "profileOther">
  | RouteProp<HomeStackParamList, "Me">
  | RouteProp<FeedStackParamList, "feedProfile">;

export default function ProfileScreen({
  route,
}: {
  route: ProfileScreenRouteProp;
}) {
  const { initialUserId } = route.params;
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  const userQuery = useUser(
    initialUserId ? initialUserId : providerUserId.currentUserProfileItemInView,
  );

  const user = userQuery.data;

  useEffect(() => {
    if (!user) {
      return;
    }

    getPostsByUserId(user?.uid).then((posts) => setUserPosts(posts));
  }, [user]);

  if (!user) {
    return <></>;
  }

  const ProfileHome = () => {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileNavBar user={user} />
        <ScrollView>
          <ProfileHeader user={user} />
          <ProfilePostList posts={userPosts} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="profileHome"
    >
       <Stack.Screen
         name="userPosts"
         component={FeedScreen}
         options={{ headerShown: false }}
         initialParams={{ profile: true }}
         />
        <Stack.Screen
          name="profileOther"
          component={ProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ initialUserId: user.uid }}
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
          name="createHostingCompany"
          component={CreateHostingCompanyScreen}
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
