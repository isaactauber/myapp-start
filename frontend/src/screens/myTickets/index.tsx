import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { UserViewStackParamList } from '../../navigation/user';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getTicketsByUser } from '../../redux/slices/ticketSlice';
import QRCode from 'react-native-qrcode-svg';
import styles from './styles';
import { Ticket } from '../../../types';

interface MyTicktsProps {
  route: RouteProp<UserViewStackParamList, "myTickets">;
}

const MyTicketsScreen = ({ route }: MyTicktsProps) => {
  const userId = route.params.initialUserId;
  const dispatch: AppDispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state: RootState) => state.ticket);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getTicketsByUser(userId));
  }, [dispatch, userId]);

  const handleItemPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.text}>Loading...</Text>}
      {error && <Text style={styles.text}>Error: {error}</Text>}
      {!loading && !error && (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <Text style={styles.item}>{item.eventName}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}

      {selectedTicket && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <QRCode value={selectedTicket.qrCodeData} size={200} />
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MyTicketsScreen;
