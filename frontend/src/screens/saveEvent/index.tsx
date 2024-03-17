import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import SaveEventDateTime from "../saveEventDateTime";
import { Picker } from "@react-native-picker/picker";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface SaveEventDetailsProps {
  route: RouteProp<RootStackParamList, "saveEventDetails">;
}

enum EventTypes {
  "Stand Up Comedy",
  "Dance",
  "Theater",
  "Music",
  "Fashion",
  "Art"
}

export default function SaveEventDetailsScreen({ route }: SaveEventDetailsProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [source, setSource] = route.params.source;
  const [sourceThumb, setSourceThumb] = route.params.sourceThumb;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSaveEvent = () => {
    navigation.navigate("saveEventDateTime", { source, sourceThumb, name, description, eventType });
  };

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

      <Picker
        selectedValue={eventType}
        onValueChange={(itemValue) => setEventType(itemValue)}
        style={styles.inputText} // might want to create a specific style for the Picker
      >
        {Object.values(EventTypes).map((value) => (
          <Picker.Item label={value.toString()} value={value.toString()} />
        ))}
      </Picker>
      
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
