import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { createHost } from "../../redux/slices/hostSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { MainStackParamList } from "../../navigation/main";

interface CreateHostProps {
  route: RouteProp<MainStackParamList, "createHost">;
}

enum HostType {
  "Stand Up Comedy",
  "Dance",
  "Theater",
  "Music",
  "Sports",
  "Fashion",
  "Art"
}

export default function CreateHostScreen({ route }: CreateHostProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hostType, setHostType] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveHost = async () => {
    await dispatch(
      createHost({
        hostName: name,
        description: description,
        hostType: hostType,
      })
    );

    navigation.goBack()
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.inputText}
        maxLength={150}
        multiline={true}
        value={name}
        onChangeText={setName}
        placeholder="Host name"
        placeholderTextColor="#666"
      />
      <TextInput
        style={[styles.inputText, styles.descriptionInput]}
        maxLength={150}
        multiline={true}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your host"
        placeholderTextColor="#666"
      />

      <Picker
        selectedValue={hostType}
        onValueChange={(itemValue) => setHostType(itemValue)}
        style={styles.inputText}
      >
      {Object.values(HostType).filter((value) => typeof value === 'string').map((value) => (
        <Picker.Item key={value} label={value.toString()} value={value} />
      ))}
      </Picker>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
          <Feather name="x" size={20} color="#333" />
          <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSaveHost} style={[styles.button, styles.saveButton]}>
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
