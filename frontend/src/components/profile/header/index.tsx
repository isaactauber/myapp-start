import { View, Text, Image, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { buttonStyles } from "../../../styles";
import styles from "./styles";
import { RootState } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../screens/profile";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";
import { useFollowing } from "../../../hooks/useFollowing";
import { Feather } from "@expo/vector-icons";
import { useFollowingMutation } from "../../../hooks/useFollowingMutation";
import { useEffect, useState } from "react";
import { Host } from "../../../../types";

/**
 * Renders the header of the user profile and
 * handles all of the actions within it like follow, unfollow and
 * routing to the user settings.
 *
 * @param {Object} props
 * @param {Object} props.user information of the user to display
 * @returns
 */
export default function ProfileHeader({
  host,
}: {
  host: Host | null;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [followersCount, setFollowersCount] = useState(
    host?.followersCount || 0,
  );

  useEffect(() => {
    setFollowersCount(host?.followersCount || 0);
  }, [host]);

  const followingData = useFollowing(
    FIREBASE_AUTH.currentUser?.uid ?? null,
    host?.id ?? null,
  );
  const isFollowing =
    FIREBASE_AUTH.currentUser?.uid && host?.id && followingData.data
      ? followingData.data
      : false;

  const isFollowingMutation = useFollowingMutation();

  // const renderFollowButton = () => {
  //   if (isFollowing) {
  //     return (
  //       <View style={{ flexDirection: "row" }}>
  //         <TouchableOpacity
  //           style={buttonStyles.grayOutlinedButton}
  //           onPress={() => {
  //             if (host?.id) {
  //               // TODO: re-enable chat
  //               // navigation.navigate("chatSingle", { contactId: user.uid });
  //               navigation.navigate("profileOther");
  //             }
  //           }}
  //         >
  //           <Text style={buttonStyles.grayOutlinedButtonText}>Message</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={buttonStyles.grayOutlinedIconButton}
  //           onPress={() => {
  //             if (host?.id) {
  //               isFollowingMutation.mutate({
  //                 otherUserId: host.id,
  //                 isFollowing,
  //               });
  //               setFollowersCount(followersCount - 1);
  //             }
  //           }}
  //         >
  //           <Feather name="user-check" size={20} />
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <TouchableOpacity
  //         style={buttonStyles.filledButton}
  //         onPress={() => {
  //           if (host?.id) {
  //             isFollowingMutation.mutate({
  //               otherUserId: host.id,
  //               isFollowing,
  //             });
  //             setFollowersCount(followersCount + 1);
  //           }
  //         }}
  //       >
  //         <Text style={buttonStyles.filledButtonText}>Follow</Text>
  //       </TouchableOpacity>
  //     );
  //   }
  // };

  return (
    host && (
      <View style={styles.container}>
        {host.photoURL ? (
          <Image style={styles.avatar} source={{ uri: host.photoURL }} />
        ) : (
          <Avatar.Icon size={80} icon={"account"} />
        )}
        <Text style={styles.emailText}>{host.displayName || host.hostName}</Text>
        <View style={styles.counterContainer}>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{host.followingCount}</Text>
            <Text style={styles.counterLabelText}>Following</Text>
          </View>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{followersCount}</Text>
            <Text style={styles.counterLabelText}>Followers</Text>
          </View>
          <View style={styles.counterItemContainer}>
            <Text style={styles.counterNumberText}>{host.likesCount}</Text>
            <Text style={styles.counterLabelText}>Likes</Text>
          </View>
        </View>
        {/* TODO: fix this */}
        {/* {FIREBASE_AUTH.currentUser?.uid === user.uid ? (
          <TouchableOpacity
            style={buttonStyles.grayOutlinedButton}
            onPress={() => navigation.navigate("editProfile")}
          >
            <Text style={buttonStyles.grayOutlinedButtonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        ) : (
          renderFollowButton()
        )} */}
      </View>
    )
  );
}
