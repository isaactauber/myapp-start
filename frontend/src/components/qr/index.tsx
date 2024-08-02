import React, { useEffect, useState } from 'react';
import { View, Modal, Button, Alert, Text } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getTicketsByEventId, updateTicketScannedStatus } from '../../redux/slices/ticketSlice';
import styles from './styles';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string | null;
  onConfirm: (userId: string) => void;
}

const QRScannerModal = ({ visible, onClose, eventId, onConfirm }: QRScannerModalProps) => {
  const [scanned, setScanned] = useState(false);
  const tickets = useSelector((state: RootState) => state.ticket.tickets);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (eventId) {
      dispatch(getTicketsByEventId(eventId));
    }
  }, [dispatch, eventId]);

  const handleBarCodeScanned = async (event: BarCodeReadEvent) => {
    if (!eventId || scanned) return;

    setScanned(true);

    let scannedData: any;
    try {
      scannedData = JSON.parse(event.data);
    } catch (error) {
      Alert.alert("Invalid QR Code", "The scanned QR code is not valid.");
      setScanned(false);
      return;
    }


    const matchingTicket = tickets.find(ticket => {
      const ticketData = JSON.parse(ticket.qrCodeData);
      return ticket.eventId === eventId && JSON.stringify(ticketData) === JSON.stringify(scannedData);
    });

    if (matchingTicket) {
      if (matchingTicket.isScanned) {
        Alert.alert("Ticket Scanned", "This ticket has already been scanned.", [
          {
            text: "OK",
            onPress: () => setScanned(false),
          },
        ]);
        return;
      }
      Alert.alert(
        "Confirm Ticket",
        `User ID: ${matchingTicket.userID}`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setScanned(false),
          },
          {
            text: "Confirm",
            onPress: async () => {
              console.log(`Updating ticket ${matchingTicket.uid} as scanned`);
              const resultAction = await dispatch(updateTicketScannedStatus({ ticketId: matchingTicket.uid, isScanned: true }));
              if (updateTicketScannedStatus.fulfilled.match(resultAction)) {
                console.log(`Ticket ${matchingTicket.uid} successfully updated`);
                onConfirm(matchingTicket.userID);
              } else {
                console.error("Failed to update ticket scanned status: ", resultAction.payload);
              }
              setScanned(false);
            },
          }
        ]
      );
    } else {
      Alert.alert("Invalid Ticket", "This ticket does not match any records for the selected event.", [
        {
          text: "OK",
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <RNCamera
            style={styles.scanner}
            onBarCodeRead={handleBarCodeScanned}
            captureAudio={false}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default QRScannerModal;
