import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/slices/eventSlice";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/main";
import { AppDispatch } from "../../redux/store";
import { HostViewStackParamList } from "../../navigation/host";
import { createPost } from "../../redux/slices/postSlice";

interface SaveEventDateTimeProps {
  route: RouteProp<MainStackParamList, "saveEventDateTime">;
}

interface CreateEventReturnType {
  eventId: string;
}

export default function SaveEventDateTime({ route }: SaveEventDateTimeProps) {
  const [date, setDate] = useState(new Date());
  const [requestRunning, setRequestRunning] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateTimes, setDateTimes] = useState<Date[]>([]);

  const hostNavigation = useNavigation<NativeStackNavigationProp<HostViewStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveEvent = async () => {
    try {
      setRequestRunning(true);
      setDateTimes(route.params.dateTimes.concat(date));

      // Dispatch createEvent and assert the return type
      const actionResult = await dispatch(
        createEvent({
          creatorHost: route.params.currentHost,
          eventName: route.params.name,
          description: route.params.description,
          dateTimes: dateTimes,
          eventType: route.params.eventType,
          location: route.params.location,
          availableTickets: route.params.availableTickets,
        })
      );
      // Use a type guard to safely access the payload
      if ('payload' in actionResult && actionResult.payload) {
        const { eventId } = actionResult.payload as CreateEventReturnType;
        await dispatch(
          createPost({
            creatorHost: route.params.currentHost,
            event: eventId,
            video: route.params.source,
            thumbnail: route.params.sourceThumb,
          }),
        );
        hostNavigation.navigate("home", { currentHost: route.params.currentHost });
      } else {
        throw new Error("Event creation failed, event ID not found.");
      }
    } catch (error) {
      console.error("Error in handleSaveEvent: ", error);
      setRequestRunning(false);
    }
  };

  // TODO: I don't think handling date times is working correctly
  const handleAddAnotherDate = () => {
    if (route.params.dateTimes)
      setDateTimes(route.params.dateTimes.concat(date));
    else
      setDateTimes([date]);
    rootNavigation.navigate("saveEventDateTime", {
      currentHost: route.params.currentHost,
      source: route.params.source,
      sourceThumb: route.params.sourceThumb,
      name: route.params.name,
      description: route.params.description,
      eventType: route.params.eventType,
      location: route.params.location,
      availableTickets: route.params.availableTickets,
      dateTimes: dateTimes
    });
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  if (requestRunning) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator color="red" size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>Select Date and Time</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={date}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => hostNavigation.goBack()}
          style={styles.cancelButton}
        >
          <Feather name="x" size={24} color="black" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddAnotherDate}
          style={styles.postButton}
        >
          <Feather name="corner-left-up" size={24} color="blue" />
          <Text style={styles.postButtonText}>Add Additional Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveEvent}
          style={styles.postButton}
        >
          <Feather name="corner-left-up" size={24} color="white" />
          <Text style={styles.postButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
