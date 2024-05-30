import React, { useContext, useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { MainStackParamList } from "../../navigation/main";
import { Company } from "../../../types";
import { useUser } from "../../hooks/useUser";
import { CurrentUserProfileItemInViewContext } from "../../navigation/feed";
import { getCompaniesByUserId } from "../../services/company";
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import styles from './styles';
import { UserViewStackParamList } from "../../navigation/user";

interface SwitchViewScreenProps {
  route: RouteProp<UserViewStackParamList, "create">;
}

export default function SwitchViewScreen({ route }: SwitchViewScreenProps) {
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [eventCompany, setEventCompany] = useState('');
  const [userId, setUserId] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { initialUserId } = route.params;
  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  const userQuery = useUser(
    initialUserId ? initialUserId : providerUserId.currentUserProfileItemInView,
  );

  const user = userQuery.data;

  const handleOnPress = () => {
    navigation.navigate("hostView", { hostId: eventCompany, userId: userId });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getCompaniesByUserId(user?.uid).then((companies) => setUserCompanies(companies));
    setUserId(user?.uid)
  }, [user]);

  return (
    <View style={styles.container}>
      <Text>Select a Company:</Text>
      <Picker
        selectedValue={eventCompany}
        onValueChange={(itemValue: React.SetStateAction<string>) => setEventCompany(itemValue)}
        style={styles.inputText}
      >
      {userCompanies.map((company, index) => (
          <Picker.Item key={index} label={company.companyName} value={company.id} />
        ))}
      </Picker>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
          <Feather name="x" size={20} color="#333" />
          <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOnPress} style={[styles.button, styles.saveButton]}>
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
