import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/main";
import { Picker } from "@react-native-picker/picker";
import { createCompany } from "../../redux/slices/companySlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { HostViewStackParamList } from "../../navigation/host";

interface CreateHostingCompanyProps {
  route: RouteProp<HostViewStackParamList, "createHostingCompany">;
}

enum CompanyType {
  "Stand Up Comedy",
  "Dance",
  "Theater",
  "Music",
  "Sports",
  "Fashion",
  "Art"
}

export default function CreateHostingCompanyScreen({ route }: CreateHostingCompanyProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [companyType, setCompanyType] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveCompany = async () => {
    await dispatch(
      createCompany({
        companyName: name,
        description: description,
        companyType: companyType,
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
        placeholder="Company name"
        placeholderTextColor="#666"
      />
      <TextInput
        style={[styles.inputText, styles.descriptionInput]}
        maxLength={150}
        multiline={true}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your company"
        placeholderTextColor="#666"
      />

      <Picker
        selectedValue={companyType}
        onValueChange={(itemValue) => setCompanyType(itemValue)}
        style={styles.inputText}
      >
      {Object.values(CompanyType).filter((value) => typeof value === 'string').map((value) => (
        <Picker.Item key={value} label={value.toString()} value={value} />
      ))}
      </Picker>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
          <Feather name="x" size={20} color="#333" />
          <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSaveCompany} style={[styles.button, styles.saveButton]}>
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
