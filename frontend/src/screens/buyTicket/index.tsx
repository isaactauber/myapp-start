import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { getAvailableTicketsByEvent, updateAvailableTickets, appendToGuestList } from "../../redux/slices/eventSlice";
import { createTicket } from "../../redux/slices/ticketSlice";
import { MainStackParamList } from '../../navigation/main';
import { UserViewStackParamList } from '../../navigation/user';
import styles from './styles'; 

interface BuyTicketProps {
  route: RouteProp<MainStackParamList, "buyTicket">;
}

export default function BuyTicketScreen({ route }: BuyTicketProps) {
  const eventId = route.params.eventId;
  const userId = route.params.userId;
  const [availableTickets, setAvailableTickets] = useState(0);
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const navigation = useNavigation<NativeStackNavigationProp<UserViewStackParamList>>();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchAvailableTickets = async (eventId: string) => {
      const resultAction = await dispatch(getAvailableTicketsByEvent(eventId));
      if (getAvailableTicketsByEvent.fulfilled.match(resultAction)) {
        setAvailableTickets(resultAction.payload);
      }
    };
    fetchAvailableTickets(eventId);
  }, [dispatch]);

  const handleCreateTicket = async () => {
    if (ticketsToBuy < 1 || ticketsToBuy > availableTickets) {
      Alert.alert("Invalid number of tickets", `Please enter a number between 1 and ${availableTickets}`);
      return;
    }

    for (let i = 0; i < ticketsToBuy; i++) {
      const resultAction = await dispatch(
        createTicket({
          userId: userId,
          eventId: eventId,
        })
      );

      if (!createTicket.fulfilled.match(resultAction)) {
        Alert.alert("Error", "Failed to create ticket");
        return;
      }
    }

    await dispatch(updateAvailableTickets({ eventId, numberOfTickets: availableTickets - ticketsToBuy }));

    await dispatch(appendToGuestList({ eventId, userId, ticketsToBuy }));

    navigation.navigate("myTickets", { initialUserId: userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>How many tickets would you like to buy?</Text>
      <TextInput
        value={ticketsToBuy.toString()}
        onChangeText={(text) => setTicketsToBuy(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.button}>
        <Button title="Submit" onPress={handleCreateTicket} />
      </View>
      <View style={styles.button}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
