import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOTIFICATION");
        console.log(notification);
        const userName = notification.request.content.data.userName;
      }
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        console.log("RESPONSE");
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      }
    );
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);
  async function notificationHandler() {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Noti",
        body: "body Notifi",
        data: { userName: "Tam" },
      },
      trigger: {
        seconds: 2,
      },
    });
  }
  return (
    <View style={styles.container}>
      <Button title="notification" onPress={notificationHandler} />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
