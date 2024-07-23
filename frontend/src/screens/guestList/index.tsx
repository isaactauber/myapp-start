import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { HostViewStackParamList } from '../../navigation/host';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getEventsByHost, getGuestListByEventId, updateGuestListAfterScan } from '../../redux/slices/eventSlice';
import styles from './styles';
import QRScannerModal from '../../components/qr';

interface GuestListsProps {
  route: RouteProp<HostViewStackParamList, "guestLists">;
}

const GuestListsScreen = ({ route }: GuestListsProps) => {
  const currentHost = route.params.currentHost;
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector((state: RootState) => state.event.currentHostEvents);
  const [guestList, setGuestList] = useState<Record<string, number> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getEventsByHost(currentHost));
  }, [dispatch, currentHost]);

  const handleEventPress = async (eventId: string) => {
    const resultAction = await dispatch(getGuestListByEventId(eventId));
    if (getGuestListByEventId.fulfilled.match(resultAction)) {
      setGuestList(resultAction.payload);
      setSelectedEventId(eventId);
      setModalVisible(true);
    } else {
      Alert.alert("Error", "Failed to fetch guest list");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setGuestList(null);
    setSelectedEventId(null);
  };

  const handleScanTickets = () => {
    setQrScannerVisible(true);
    setModalVisible(false);
  };

  const handleQrScannerClose = () => {
    setQrScannerVisible(false);
  };

  const handleConfirmScan = async (ticketUserId: string) => {
    if (selectedEventId) {
      const resultAction = await dispatch(updateGuestListAfterScan({ eventId: selectedEventId, userId: ticketUserId }));
      if (updateGuestListAfterScan.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Ticket scan confirmed.");
      } else {
        Alert.alert("Error", "Failed to update guest list.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {events && (
        <FlatList
          data={events}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item.uid)}>
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
              <Button title="Scan Tickets" onPress={handleScanTickets} />
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}

      <QRScannerModal
        visible={qrScannerVisible}
        onClose={handleQrScannerClose}
        eventId={selectedEventId}
        onConfirm={handleConfirmScan}
      />
    </View>
  );
};

export default GuestListsScreen;
