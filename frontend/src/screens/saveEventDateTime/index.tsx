import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTimes, setDateTimes] = useState<Date[]>([]);


  const hostNavigation = useNavigation<NativeStackNavigationProp<HostViewStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveEvent = async () => {
    try {
      setRequestRunning(true);
      console.log("dateTimes: " + route.params.dateTimes);
      setDateTimes(route.params.dateTimes.concat(date));
      
      // Dispatch createEvent and assert the return type
      const actionResult = await dispatch(
        createEvent({
          eventHost: route.params.eventHost,
          eventName: route.params.name,
          description: route.params.description,
          dateTimes: dateTimes,
          eventType: route.params.eventType,
          location: route.params.location
        })
      );
  
      // Use a type guard to safely access the payload
      if ('payload' in actionResult && actionResult.payload) {
        const { eventId } = actionResult.payload as CreateEventReturnType;
        await dispatch(
          createPost({
            event: eventId,
            video: route.params.source,
            thumbnail: route.params.sourceThumb,
          }),
        );
        
        hostNavigation.navigate("home");
      } else {
        throw new Error("Event creation failed, event ID not found.");
      }
    } catch (error) {
      console.error("Error in handleSaveEvent: ", error);
      setRequestRunning(false);
    }
  };
  

  const handleAddAnotherDate = () => {
    if (route.params.dateTimes)
      setDateTimes(route.params.dateTimes.concat(date));
    else
      setDateTimes([date]);
    console.log("dateTimes: " + dateTimes);
    rootNavigation.navigate("saveEventDateTime", { 
      source: route.params.source, 
      sourceThumb: route.params.sourceThumb,
      eventHost: route.params.eventHost,
      name: route.params.name,
      description: route.params.description,
      eventType: route.params.eventType,
      location: route.params.location,
      dateTimes: dateTimes });
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    console.log("date: " + date);
};


  const showDatepicker = () => {
    setShowDatePicker(true);
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
        <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
            <Text>Select Date and Time</Text>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"datetime"}
                // is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}
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
          onPress={() => handleAddAnotherDate()}
          style={styles.postButton}
        >
          <Feather name="corner-left-up" size={24} color="blue" />
          <Text style={styles.postButtonText}>Add Additional Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSaveEvent()}
          style={styles.postButton}
        >
          <Feather name="corner-left-up" size={24} color="white" />
          <Text style={styles.postButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
