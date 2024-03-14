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
import { RootStackParamList } from "../../navigation/main";
import { AppDispatch } from "../../redux/store";
import { HomeStackParamList } from "../../navigation/home";

interface SaveEventDateTimeProps {
  route: RouteProp<RootStackParamList, "saveEventDateTime">;
}

export default function SaveEventDateTime({ route }: SaveEventDateTimeProps) {
  const [date, setDate] = useState(new Date());
  const [requestRunning, setRequestRunning] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveEvent = () => {
    setRequestRunning(true);
    dispatch(
      createEvent({
        eventName: route.params.name,
        description: route.params.description,
        date: date
      })
    )
      .then(() => navigation.navigate("feed"))
      .catch(() => setRequestRunning(false));
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
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
          <Text style={styles.postButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
