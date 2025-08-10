import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
    return (
        <Stack screenLayout={({ children }) => (
            <SafeAreaView style={{minHeight: '100%'}}>
                <ImageBackground source={require('../../assets/images/login_bg.jpg')} style={{minHeight: '100%'}}>
                    <LinearGradient
                        style={{ flex: 1 }}
                        colors={['rgba(255, 77, 77, 0.8)', 'rgba(27, 37, 96, 0.8)']}
                        start={{ x: 0.5, y: 0}}
                        end={{ x: 0.5, y: 1}}
                    >
                        {children}
                    </LinearGradient>
                </ImageBackground>
            </SafeAreaView>
        )} screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="forgotPassword" />
        </Stack>
    )
}