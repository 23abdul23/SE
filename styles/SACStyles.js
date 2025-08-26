import { StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../utils/constants";

export default StyleSheet.create({
  roomPage: {
    padding: 16,
    fontFamily: "Arial",
  },
  pageTitle:{
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },

  /* Header */
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 24,
  },
  homeIcon: {
    position: "absolute",
    left: 0,
    fontSize: 26,
    color: "#333",
  },

  /* Room Card */
  roomCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 160,
    justifyContent: "space-between",
  },

  /* Room Name */
  roomName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    color: "#222",
  },

  /* Notify Button */
  notifyBtn: {
    backgroundColor: "transparent",
    textDecorationLine: "underline",
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },

  /* Complaint Section */
  complaintSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: 12,
    color: "#d9534f",
    marginTop: "auto",
  },
  warnIcon: {
    marginRight: 4,
    fontSize: 12,
  },

  /* Leave Time */
  leaveTime: {
    fontSize: 14,
    color: "#666", // lighter text
    marginTop: 4,
  },

  /* Complaint Modal */
  complaintModal: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalTextarea: {
    width: "100%",
    height: 80,
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalPrimaryBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  modalPrimaryBtnText: {
    color: "white",
    fontSize: 14,
  },
  modalCancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  modalCancelBtnText: {
    fontSize: 14,
    color: "#000",
  },

//   topSection: {
//   alignItems: "flex-end",
// },

occupancyStatus: {
  fontSize: 14,
  color: "#555",
  marginTop: 4,
},

bottomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f2dedeff",
  paddingVertical: 6,
  borderRadius: 6,
  marginTop: 10,
},

notifyText: {
  fontSize: 13,
  color: "#000",
  textDecorationLine: "underline",
},
scrollContainer: {
  paddingBottom: 20,
},
});
