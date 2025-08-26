import { StyleSheet } from "react-native"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  userName: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  studentId: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  logoutButton: {
    backgroundColor: COLORS.white + "20",
    marginTop : 15,
    borderRadius: 8,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.md,
  },
  quickActions: {
    marginTop: SPACING.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[700],
    textAlign: "center",
  },
})
