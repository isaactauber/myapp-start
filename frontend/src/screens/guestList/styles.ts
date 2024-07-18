import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  item: {
    padding: 10,
    fontSize: 18,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  guestItem: {
    padding: 10,
    fontSize: 18,
    color: '#333',
  },
  text: {
    fontSize: 20,
    color: '#606060',
  }
});

export default styles;
