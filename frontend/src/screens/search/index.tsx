import React, { useEffect, useState } from "react";
import { TextInput, FlatList, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SearchUserItem from "../../components/search/userItem";
import { queryUsersByEmail } from "../../services/user";
import styles from "./styles";
import { Event, SearchUser } from "../../../types";
import { getAllEvents } from "../../redux/slices/eventSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function SearchScreen() {
  const [textInput, setTextInput] = useState("");
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const resultAction = await dispatch(getAllEvents());
      if (getAllEvents.fulfilled.match(resultAction)) {
        setEvents(resultAction.payload);
      }
    };
    console.log("rrr : " + events.at(1)?.description);
    fetchEvents();
  }, [dispatch]);

  useEffect(() => {
    queryUsersByEmail(textInput).then((users) => setSearchUsers(users));
  }, [textInput]);

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
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.eventName}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <FlatList
        data={searchUsers}
        renderItem={({ item }) => <SearchUserItem item={item} />}
        keyExtractor={(item) => item.id}
      /> */}
    </SafeAreaView>
  );
}
