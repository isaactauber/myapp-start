import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface SaveEventDetailsProps {
  route: RouteProp<RootStackParamList, "saveEventDetails">;
}

enum EventTypes {
  "Stand Up Comedy",
  "Dance",
  "Theater",
  "Music",
  "Sports",
  "Fashion",
  "Art"
}

export default function SaveEventDetailsScreen({ route }: SaveEventDetailsProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  let dateTimes: Date[] = [];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSaveEvent = () => {
    const source = route.params.source;
    const sourceThumb = route.params.sourceThumb;
    navigation.navigate("saveEventDateTime", { source, sourceThumb, name, description, eventType, location, dateTimes });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.inputText}
        maxLength={150}
        multiline={true}
        value={name}
        onChangeText={setName}
        placeholder="Event name"
        placeholderTextColor="#666"
      />
      <TextInput
        style={[styles.inputText, styles.descriptionInput]}
        maxLength={150}
        multiline={true}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your event"
        placeholderTextColor="#666"
      />

      <Picker
        selectedValue={eventType}
        onValueChange={(itemValue) => setEventType(itemValue)}
        style={styles.inputText}
      >
      {Object.values(EventTypes).filter((value) => typeof value === 'string').map((value) => (
        <Picker.Item key={value} label={value.toString()} value={value} />
      ))}
      </Picker>

      <GooglePlacesAutocomplete
        placeholder='Enter Location'
        fetchDetails={true}
        onPress={(data, details = null) => {
          setLocation(data.description);
        }}
        query={{
          key: 'AIzaSyAN9ZnOOX2Qb21Xuq6LcY1nZ8MV_hwq34c',
          language: 'en',
        }}
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
