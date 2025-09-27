import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BackIcon from '../../assets/icons/back.svg';
import SettingsIcon from '../../assets/icons/settings-filled.svg';
import AppText from './AppText';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';


interface HeaderProps {
    showBack?: boolean;
    title?: React.ReactNode;
    showSettings?: boolean;
    onBack?: () => void;
    onSettings?: () => void;
    rightComponent?: React.ReactNode;
    leftComponent?: React.ReactNode;
    styles: any;
    appTheme: any;
}

const Header: React.FC<HeaderProps> = ({showBack, title,showSettings,onBack,onSettings,rightComponent, styles, leftComponent}) =>  {
    const route = useRoute<RouteProp<RootStackParamList>>();
    return (
        
                <View style={styles.ContainerBox}>
                    {showBack && (
                        <TouchableOpacity onPress={onBack}>
                            <BackIcon width={22} height={22} />
                        </TouchableOpacity>
                    )}
                    {leftComponent ? (
                        <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                        {leftComponent}
                        {typeof title === 'string' ? (
                            <AppText variant='h2'>{title}</AppText>
                        ) : (
                            title
                        )}
                        </View>
                    ) : (
                        <>
                        {typeof title === 'string' ? (
                            <AppText variant='h2'>{title}</AppText>
                        ) : (
                            title
                        )}
                        </>
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

const mainStyles = StyleSheet.create({
    chatBox: {

    },
});