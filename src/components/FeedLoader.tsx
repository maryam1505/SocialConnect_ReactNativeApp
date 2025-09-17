import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

const FeedLoader = ({ visible }: { visible: boolean }) => {
  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FeedLoader;
