import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/slices/eventSlice";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/home";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function SaveEventScreen() {
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [requestRunning, setRequestRunning] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useDispatch();

  const handleSaveEvent = () => {
    setRequestRunning(true);
    dispatch<any>(createEvent({ description, eventName }))
     .then(() => navigation.navigate("feed"))
     .catch(() => setRequestRunning(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.inputText}
          maxLength={150}
          multiline
          onChangeText={(text) => setEventName(text)}
          placeholder="Event name"
          placeholderTextColor="#666"
        />
        <TextInput
          style={[styles.inputText, styles.descriptionInput]}
          maxLength={150}
          multiline
          onChangeText={(text) => setDescription(text)}
          placeholder="Describe your event"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
        >
          <Feather name="x" size={20} color="#333" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveEvent}
          style={[styles.button, styles.saveButton]}
        >
          {requestRunning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="corner-left-up" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
