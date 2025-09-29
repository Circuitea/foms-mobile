import { GestureResponderEvent, Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export default function Button({ title, onPress, buttonStyle, textStyle }: ButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={StyleSheet.flatten([styles.button, buttonStyle])}
        >
            <Text style={StyleSheet.flatten([styles.text, textStyle])}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        backgroundColor: Platform.OS === 'android' ? '#2196F3' : '#007AFF',
        paddingVertical: 5,
        borderRadius: 50,
        justifyContent: 'center',
        marginVertical: 10
    },
    text: {
        textAlign: 'center',
        color: 'white',
    }
})