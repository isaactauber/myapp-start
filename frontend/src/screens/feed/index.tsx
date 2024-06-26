import { FlatList, View, Dimensions, ViewToken, StyleSheet } from "react-native";
import styles from "./styles";
import PostSingle, { PostSingleHandles } from "../../components/general/post";
import { useContext, useEffect, useRef, useState } from "react";
import { getFeed, getPostsByHostId } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { UserViewStackParamList } from "../../navigation/user";
import { HostViewStackParamList } from "../../navigation/host";
import {
  CurrentUserProfileItemInViewContext,
  FeedStackParamList,
} from "../../navigation/feed";
import useMaterialNavBarHeight from "../../hooks/useMaterialNavBarHeight";
import { useIsFocused } from '@react-navigation/native';
import { ProfileStackParamList } from "../profile";

type FeedScreenRouteProp =
  | RouteProp<HostViewStackParamList, "hostPosts">
  | RouteProp<ProfileStackParamList, "userPosts">
  | RouteProp<UserViewStackParamList, "feed">
  | RouteProp<FeedStackParamList, "feedList">;

interface PostViewToken extends ViewToken {
  item: Post;
}

export default function FeedScreen({ route }: { route: FeedScreenRouteProp }) {
  const isFocused = useIsFocused();
  const { setCurrentUserProfileItemInView } = useContext(CurrentUserProfileItemInViewContext);
  const { creator, profile } = route.params as { creator: string; profile: boolean; };
  const [posts, setPosts] = useState<Post[]>([]);
  const mediaRefs = useRef<Record<string, PostSingleHandles | null>>({});
  const [viewableItems, setViewableItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (profile && creator) {
      getPostsByHostId(creator).then(setPosts);
    } else {
      getFeed().then(setPosts);
    }
  }, [profile, creator]);

  useEffect(() => {
    Object.keys(mediaRefs.current).forEach((key) => {
      const postHandle = mediaRefs.current[key];
      if (postHandle) {
        if (isFocused && viewableItems.has(key)) {
          postHandle.play();
        } else {
          postHandle.stop();
        }
      }
    });
  }, [isFocused, viewableItems]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: PostViewToken[] }) => {
    const newViewableItems = new Set(viewableItems.map(item => item.item.id));
    setViewableItems(newViewableItems);
    viewableItems.forEach(item => {
      const postHandle = mediaRefs.current[item.item.id];
      if (postHandle) {
        postHandle.play();
      }
    });
  });

  const feedItemHeight = Dimensions.get("window").height - useMaterialNavBarHeight(profile);

  const renderItem = ({ item, index }: { item: Post; index: number }) => (
    <View style={{ height: feedItemHeight, backgroundColor: "black" }}>
      <PostSingle item={item} ref={(PostSingeRef) => (mediaRefs.current[item.id] = PostSingeRef)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        windowSize={4}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        renderItem={renderItem}
        pagingEnabled
        keyExtractor={(item) => item.id}
        decelerationRate={"fast"}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
    </View>
  );
}
