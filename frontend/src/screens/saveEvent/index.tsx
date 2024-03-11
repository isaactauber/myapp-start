import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/slices/eventSlice";
// import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { AppDispatch } from "../../redux/store";
import { HomeStackParamList } from "../../navigation/home";

// interface SaveEventScreenProps {
//   route: RouteProp<RootStackParamList, "saveEvent">;
// }

export default function SaveEventScreen() {
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  // const [eventDate, setEventDate] = useState(new Date());
  const [requestRunning, setRequestRunning] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const dispatch: AppDispatch = useDispatch();
  const handleSaveEvent = () => {
    setRequestRunning(true);
    // console.log("saving event...");
    dispatch(
      createEvent({
        description,
        eventName,
        // eventDate,
      }),
    )
      .then(() => navigation.navigate("feed"))
      .catch(() => setRequestRunning(false));
  };

  if (requestRunning) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator color="red" size="large" />
      </View>
    );
  }

  // const handleDateChange = (event: Event, selectedDate?: Date) => {
  //   if (selectedDate) {
  //     console.log("saving date");
  //     setEventDate(selectedDate);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Feather name="x" size={24} color="black" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSaveEvent()}
          style={styles.postButton}
        >
          <Feather name="corner-left-up" size={24} color="white" />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.inputText}
          maxLength={150}
          multiline
          onChangeText={(text) => setEventName(text)}
          placeholder="Event name"
        />
        <TextInput
          style={styles.inputText}
          maxLength={150}
          multiline
          onChangeText={(text) => setDescription(text)}
          placeholder="Describe your event"
        />
        {/* <DateTimePicker
          mode="single"
          date={eventDate}
          onChange={handleDateChange as any}
          
        /> */}
        {/* <Image
          style={styles.mediaPreview}
          source={{ uri: route.params.source }}
        /> */}
      </View>
      <View style={styles.spacer} />
    </View>
  );
}
