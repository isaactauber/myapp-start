import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { HostViewStackParamList } from '../../navigation/host';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getEventsByHost, getGuestListByEventId } from '../../redux/slices/eventSlice';
import styles from './styles';

interface GuestListsProps {
  route: RouteProp<HostViewStackParamList, "guestLists">;
}

const GuestListsScreen = ({ route }: GuestListsProps) => {
  const currentHost = route.params.currentHost;
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector((state: RootState) => state.event.currentHostEvents);
  const [guestList, setGuestList] = useState<Record<string, number> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getEventsByHost(currentHost));
  }, [dispatch, currentHost]);

  const handleEventPress = async (eventId: string) => {
    const resultAction = await dispatch(getGuestListByEventId(eventId));
    if (getGuestListByEventId.fulfilled.match(resultAction)) {
      setGuestList(resultAction.payload);
      setModalVisible(true);
    } else {
      Alert.alert("Error", "Failed to fetch guest list");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setGuestList(null);
  };

  return (
    <View style={styles.container}>
      {events && (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item.id)}>
              <Text style={styles.item}>{item.eventName}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {guestList && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Guest List</Text>
              <FlatList
                data={Object.entries(guestList)}
                keyExtractor={([userId]) => userId}
                renderItem={({ item: [userId, tickets] }) => (
                  <Text style={styles.guestItem}>{`User ID: ${userId}, Tickets: ${tickets}`}</Text>
                )}
              />
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default GuestListsScreen;
