import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "./colors";

const { width, height } = Dimensions.get("window");

export const HEADER_HEIGHT = height * 0.28;
export const LOGO_SIZE = width * 0.28;

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    width: "100%",
    height: 397,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: HEADER_HEIGHT * 0.7,
    paddingBottom: 30,
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 22,
    paddingTop: 44,
    paddingBottom: 44,
    marginTop: 0,
    alignItems: "left",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtitle,
    marginBottom: 28,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 7,
  },
  input: {
    height: 48,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.inputBg,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
});
