import React, { ReactNode } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Variant = "h1" | "h2" | "h3" | "h4" |"body" | "small" | "caption";

type Props = TextProps & {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    variant?: Variant;
    secondary?: boolean;
    error?:boolean;
};

export default function AppText({ children, style, variant = "body", secondary = false, error= false, ...props }: Props) {
    const { appTheme } = useTheme();
    const baseStyle = appTheme.typography[variant];
    
    return (
    <Text style={[ baseStyle, secondary && { color: appTheme.colors.textSecondary }, style, error && {color: appTheme.colors.error} ]} {...props} >
        {children}
    </Text>
    );

};