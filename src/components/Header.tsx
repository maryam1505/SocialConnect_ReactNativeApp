import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BackIcon from '../../assets/icons/back.svg';
import SettingsIcon from '../../assets/icons/settings-filled.svg';
import AppText from './AppText';


interface HeaderProps {
  showBack?: boolean;
  title?: React.ReactNode;
  showSettings?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  rightComponent?: React.ReactNode;
  styles: any;
  appTheme: any;
}

const Header: React.FC<HeaderProps> = ({showBack, title,showSettings,onBack,onSettings,rightComponent,styles,appTheme}) =>  {
    return (
        <View style={styles.ContainerBox}>
            {showBack && (
                <TouchableOpacity onPress={onBack}>
                    <BackIcon width={22} height={22} />
                </TouchableOpacity>
            )}
            {title && (
                <AppText variant='h2'
                >
                {title}
                </AppText>
            )}
            {showSettings && (
                <TouchableOpacity onPress={onSettings}>
                    <SettingsIcon width={32} height={32} />
                </TouchableOpacity>
            )}
            {rightComponent}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    
});