import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import AppText from "./AppText";

interface SecondaryButtonProps {
    title: ReactNode;
    onPress: () => void;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    title,
    onPress,
    accessibilityLabel,
    style,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            style={[styles.touchableWrapper, style]}
        >

            {/* Outer Gradient Border */}
            <LinearGradient
                colors={["#200122", "#108DC7"]}
                style={styles.gradientBorder}
            >

                {/* Inner Transparent Background */}
                <View style={[styles.innerBackground, {paddingVertical: typeof title === "string" ? 12 : 5}]}>
                    {/* Gradient Text using MaskedView */}
                    <MaskedView
                        maskElement={
                        <View style={styles.row}>
                            {typeof title === "string" ? (
                                <AppText variant="h4" style={styles.textMask}>{title}</AppText>
                            ) : (
                                title
                            )}
                        </View>
                        }
                    >
                        <LinearGradient colors={["#200122", "#108DC7"]}>
                            <View style={styles.row}>
                                {typeof title === "string" ? (
                                    <AppText variant="h4" style={[styles.textMask, { opacity: 0 }, ]}>{title}</AppText>
                                ) : (
                                    title
                                )}
                            </View>
                        </LinearGradient>
                        
                    </MaskedView>
                </View>

            </LinearGradient>

        </TouchableOpacity>
    );
}
export default SecondaryButton;

const styles = StyleSheet.create({
    touchableWrapper: {
        width: "100%",
        alignItems: "center",
    },
    gradientBorder: {
        width: "80%",
        padding: 2,
        borderRadius: 30,
        marginTop: 10,
        overflow: "hidden",
    },
    innerBackground: {
        backgroundColor: "#fff",
        borderRadius: 40,
        
        alignItems: "center",
        width: "100%",
    },
    textMask: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
});