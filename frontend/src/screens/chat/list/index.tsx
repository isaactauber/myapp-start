import { Text, FlatList } from "react-native";
import React from "react";
import NavBarGeneral from "../../../components/general/navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem from "../../../components/chat/list/item";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Chat } from "../../../../types";
import { RootStackParamList } from "../../../navigation/main";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatSingleScreen from "../single";

const Stack = createNativeStackNavigator<RootStackParamList>();

const ChatScreen = () => {
  const chats = useSelector((state: RootState) => state.chat.list);

  const renderItem = ({ item }: { item: Chat }) => {
    return <ChatListItem chat={item} />;
  };

  const ChatHome = () => {
    return (
      <SafeAreaView>
        <NavBarGeneral leftButton={{ display: false }} title="Direct messages" />
        <FlatList
          data={chats}
          removeClippedSubviews
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Text></Text>
      </SafeAreaView>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="chatHome"
    >
      <Stack.Screen
        name="chatHome"
        component={ChatHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chatSingle"
        component={ChatSingleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ChatScreen;
