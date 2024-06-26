import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 20,
  },
  inputText: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    marginTop: 20,
  },
  horizontalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  createButton: {
    backgroundColor: "#28a745", // Green color for the create button
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default styles;
