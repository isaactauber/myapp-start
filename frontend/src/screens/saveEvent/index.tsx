import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/slices/eventSlice";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/home";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import SaveEventDateTime from "../saveEventDateTime";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function SaveEventScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSaveEvent = () => {
    navigation.navigate("saveEventDateTime", { name, description });
  };

  const SaveEventDetails = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            style={styles.inputText}
            maxLength={150}
            multiline={true}
            value={name}
            onChangeText={setName} // Directly pass setName
            placeholder="Event name"
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.inputText, styles.descriptionInput]}
            maxLength={150}
            multiline={true}
            value={description}
            onChangeText={setDescription} // Directly pass setDescription
            placeholder="Describe your event"
            placeholderTextColor="#666"
          />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
              <Feather name="x" size={20} color="#333" />
              <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
    
            <TouchableOpacity onPress={handleSaveEvent} style={[styles.button, styles.saveButton]}>
              <Feather name="check" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    );
  }

  return (
    <Stack.Navigator
        initialRouteName="saveEventDetails"
    >
        <Stack.Screen
          name="saveEventDetails"
          component={SaveEventDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="saveEventDateTime"
          component={SaveEventDateTime}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}
