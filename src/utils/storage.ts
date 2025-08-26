import AsyncStorage from "@react-native-async-storage/async-storage";

export const setOnboardingSeen = async (): Promise<void> => {
    await AsyncStorage.setItem("OnBoardingScreen", "true");
};

export const checkOnboardingSeen = async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem("OnBoardingScreen");
    return value === "true";
};