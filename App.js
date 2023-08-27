import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
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
    async function configurePushNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      console.log(finalStatus);
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "permission require",
          "Push notification need your permission"
        );
        return;
      }
      const projectId = "c310fa6c-b200-425b-9a0e-aa3490265b88";
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log(pushTokenData);
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotification();
  }, []);
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        const userName = notification.request.content.data.userName;
      }
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
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
  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[58tlF4EqF84gWZcXhwl5Ho]",
        title: "Test- send from a device",
        body: "This is a test",
      }),
    });
  }
  return (
    <View style={styles.container}>
      <Button title="Local notification" onPress={notificationHandler} />
      <Button title="notification" onPress={sendPushNotificationHandler} />
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
