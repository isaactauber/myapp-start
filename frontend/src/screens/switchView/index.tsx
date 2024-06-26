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
import { UserViewStackParamList } from "../../navigation/user";
import { AsyncThunkAction, Dispatch, AnyAction } from "@reduxjs/toolkit";

interface SwitchViewScreenProps {
  route: RouteProp<UserViewStackParamList, "switchView">;
}

export default function SwitchViewScreen({ route }: SwitchViewScreenProps) {
  const [userHosts, setUserHosts] = useState<Host[]>([]);
  const [eventHost, setEventHost] = useState('');
  const [userId, setUserId] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { initialUserId } = route.params;
  const providerUserId = useContext(CurrentUserProfileItemInViewContext);

  const userQuery = useUser(
    initialUserId ? initialUserId : providerUserId.currentUserProfileItemInView,
  );

  const user = userQuery.data;

  const handleOnPress = () => {
    navigation.navigate("hostView", { hostId: eventHost, userId: userId });
  };

  const handleCreateNewHost = () => {
    navigation.navigate("createHost");
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getHostsByUserId(user?.uid).then((hosts) => {
      setUserHosts(hosts);
      if (hosts.length > 0) {
        setEventHost(hosts[0].id);
      }
    });
    setUserId(user?.uid);
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
        <View style={styles.horizontalButtonsContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
            <Feather name="x" size={20} color="#333" />
            <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleOnPress} 
            style={[styles.button, styles.saveButton]} 
            disabled={userHosts.length === 0}
          >
            <Feather name="check" size={20} color="#fff" />
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleCreateNewHost} style={[styles.button, styles.createButton]}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.buttonText}>Create New Host</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
