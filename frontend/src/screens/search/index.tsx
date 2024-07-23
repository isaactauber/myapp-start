import React, { useEffect, useState } from "react";
import { TextInput, FlatList, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { queryUsersByEmail } from "../../services/user";
import styles from "./styles";
import { Event, SearchUser } from "../../../types";
import { getAllEvents } from "../../redux/slices/eventSlice";
import { AppDispatch } from "../../redux/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/main";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { UserViewStackParamList } from "../../navigation/user";

interface SearchScreenProps {
  route: RouteProp<UserViewStackParamList, "search">;
}

export default function SearchScreen({ route }: SearchScreenProps) {
  const [textInput, setTextInput] = useState("");
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [events, setEvents] = useState<Event[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  useEffect(() => {
    const fetchEvents = async () => {
      const resultAction = await dispatch(getAllEvents());
      if (getAllEvents.fulfilled.match(resultAction)) {
        setEvents(resultAction.payload);
      }
    };
    fetchEvents();
  }, [dispatch]);

  useEffect(() => {
    queryUsersByEmail(textInput).then((users) => setSearchUsers(users));
  }, [textInput]);

  const handleSelectEvent = (eventId: string) => {
    navigation.navigate("buyTicket", { userId: route.params.initialUserId, eventId: eventId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        onChangeText={setTextInput}
        style={styles.textInput}
        placeholder={"Search"}
      />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectEvent(item.uid)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.eventName}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.uid}
      />
      {/* <FlatList
        data={searchUsers}
        renderItem={({ item }) => <SearchUserItem item={item} />}
        keyExtractor={(item) => item.id}
      /> */}
    </SafeAreaView>
  );
}
