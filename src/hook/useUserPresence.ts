import { useEffect } from "react";
import { AppState } from "react-native";
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "@react-native-firebase/firestore";

export const useUserPresence = () => {
  useEffect(() => {
    const app = getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const setOnline = async () => {
      await setDoc(
        userRef,
        {
          isOnline: true,
        },
        { merge: true }
      );
    };

    const setOffline = async () => {
      await setDoc(
        userRef,
        {
          isOnline: false,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    };

    // App state listener
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setOnline();
      } else {
        setOffline();
      }
    });

    // Mark online immediately
    setOnline();

    // Cleanup
    return () => {
      setOffline();
      subscription.remove();
    };
  }, []);
};
