import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { HostViewStackParamList } from '../../navigation/host';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getEventsByHost, getGuestListByEventId, updateGuestListAfterScan } from '../../redux/slices/eventSlice';
import styles from './styles';
import QRScannerModal from '../../components/qr';
import { getUserDetailsById } from '../../redux/slices/userSlice';

interface GuestListsProps {
  route: RouteProp<HostViewStackParamList, "guestLists">;
}

const GuestListsScreen = ({ route }: GuestListsProps) => {
  const currentHost = route.params.currentHost;
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector((state: RootState) => state.event.currentHostEvents);
  const userMap = useSelector((state: RootState) => state.user.users);
  const [guestList, setGuestList] = useState<Record<string, [number, number]> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getEventsByHost(currentHost));
  }, [dispatch, currentHost]);

  const handleEventPress = async (eventId: string) => {
    try {
      const resultAction = await dispatch(getGuestListByEventId(eventId));
      if (getGuestListByEventId.fulfilled.match(resultAction)) {
        const guestList = resultAction.payload;
        setGuestList(guestList);
        setSelectedEventId(eventId);

        // Fetch user names based on user IDs in the guest list
        const userIds = Object.keys(guestList);
        for (const userId of userIds) {
          console.log(`Fetching user details for user ID: ${userId}`);
          await dispatch(getUserDetailsById(userId));
        }

        setModalVisible(true);
      } else {
        Alert.alert("Error", "Failed to fetch guest list");
      }
    } catch (error) {
      console.error("Error fetching guest list: ", error);
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
      try {
        const resultAction = await dispatch(updateGuestListAfterScan({ eventId: selectedEventId, userId: ticketUserId }));
        if (updateGuestListAfterScan.fulfilled.match(resultAction)) {
          Alert.alert("Success", "Ticket scan confirmed.");
        } else {
          Alert.alert("Error", "Failed to update guest list.");
        }
      } catch (error) {
        console.error("Error updating guest list after scan: ", error);
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
              {Object.keys(guestList).length === 0 ? (
                <Text style={styles.guestItem}>Guest list empty</Text>
              ) : (
                <FlatList
                  data={Object.entries(guestList)}
                  keyExtractor={([userId]) => userId}
                  renderItem={({ item: [userId, [purchasedTickets, scannedTickets]] }) => (
                    <Text style={styles.guestItem}>{` - ${userMap[userId]?.email || userMap[userId]?.name || userId}, Tickets Purchased: ${purchasedTickets}, Tickets Scanned: ${scannedTickets}`}</Text>
                  )}
                />
              )}
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
