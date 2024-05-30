import React, { useContext, useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { MainStackParamList } from "../../navigation/main";
import { Host } from "../../../types";
import { useUser } from "../../hooks/useUser";
import { CurrentUserProfileItemInViewContext } from "../../navigation/feed";
import { getHostsByUserId } from "../../services/host";
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import styles from './styles';

interface SaveEventHostProps {
  route: RouteProp<MainStackParamList, "saveEventHost">;
}

export default function SaveEventHostScreen({ route }: SaveEventHostProps) {
  const [userHosts, setUserHosts] = useState<Host[]>([]);
  const [eventHost, setEventHost] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { initialUserId } = route.params;
  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  const userQuery = useUser(
    initialUserId ? initialUserId : providerUserId.currentUserProfileItemInView,
  );

  const user = userQuery.data;

  const handleSaveEvent = () => {
    const source = route.params.source;
    const sourceThumb = route.params.sourceThumb;
    navigation.navigate("saveEventDetails", { source, sourceThumb, eventHost });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getHostsByUserId(user?.uid).then((hosts) => setUserHosts(hosts));
  }, [user]);

  return (
    <View style={styles.container}>
      <Text>Select a Host:</Text>
      <Picker
        selectedValue={eventHost}
        onValueChange={(itemValue: React.SetStateAction<string>) => setEventHost(itemValue)}
        style={styles.inputText}
      >
      {userHosts.map((host, index) => (
          <Picker.Item key={index} label={host.hostName} value={host.id} />
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
    </View>
  );
}
