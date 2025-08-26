import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/SACStyles";

const RoomCard = ({ room }) => {
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaint, setComplaint] = useState("");

  const handleComplaintSubmit = () => {
    alert(`Complaint submitted for ${room.name}: ${complaint}`);
    setComplaint("");
    setShowComplaint(false);
  };

  return (
    <View
  style={[
    styles.roomCard,
    {
      backgroundColor: room.occupied ? "#ffe6e6" : "#e6ffe6",
    },
  ]}
>
  {/* Room Name + Status */}
  <View style={styles.topSection}>
    <Text style={styles.roomName}>{room.name}</Text>
    <Text style={styles.occupancyStatus}>
      {room.occupied ? "Occupied" : "Empty"}
    </Text>
  </View>

  <View style={{ flex: 1 }} />

  {/* Complaint Section */}
  <TouchableOpacity
    style={styles.complaintSection}
    onPress={() => setShowComplaint(true)}
  >
    <Ionicons name="warning" size={14} color="#d9534f" />
    <Text style={styles.complaintText}> Have a complaint?</Text>
  </TouchableOpacity>

  {/* Bottom Line: Only for occupied */}
  {room.occupied && (
    <View style={styles.bottomRow}>
      <Text style={styles.leaveTime}>Expected Leave Time: {room.leaveTime}</Text>
      <TouchableOpacity>
        <Text style={styles.notifyText}>
          <Ionicons name="notifications" size={14} color="black" /> Notify when empty
        </Text>
      </TouchableOpacity>
    </View>
  )}

  {/* Complaint Modal (unchanged) */}
  <Modal
    visible={showComplaint}
    transparent
    animationType="fade"
    onRequestClose={() => setShowComplaint(false)}
  >
    <View style={styles.complaintModal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Submit Complaint</Text>
        <TextInput
          style={styles.modalTextarea}
          value={complaint}
          onChangeText={setComplaint}
          placeholder="Enter your complaint..."
          multiline
        />
        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.modalPrimaryBtn}
            onPress={handleComplaintSubmit}
          >
            <Text style={styles.modalPrimaryBtnText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => setShowComplaint(false)}
          >
            <Text style={styles.modalCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </Modal>
    </View>
  );
};

export default RoomCard;
