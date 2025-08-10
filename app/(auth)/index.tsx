import Button from "@/components/Button";
import { api } from "@/lib/api";
import * as Device from 'expo-device';
import { Link, router } from "expo-router";
import { CircleAlert } from 'lucide-react-native';
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const deviceName = `${Device.deviceName} (${Device.osName} ${Device.osVersion})`
    const onSubmit = async () => {
        setErrors({});

        try {
            await api.login(email, password, deviceName);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);
            setErrors({
                email: 'Network error occurred'
            });
        }
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            >
            <View style={brandingStyles.container}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>San Juan City Disaster Risk Reduction and Management Office</Text>
            </View>
            <View style={formStyles.container}>
                <Text style={formStyles.title}>Log in to your account</Text>
                <Text style={formStyles.label}>Email Address</Text>
                <TextInput
                    style={formStyles.input}
                    placeholder="email@example.com"
                    placeholderTextColor="#A9A9A9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={val => setEmail(val)}
                    />
                {errors.email && (
                    <View style={formStyles.errorContainer}>
                        <CircleAlert size={12} color="white" />
                        <Text style={formStyles.errorText}>{errors.email}</Text>
                    </View>
                )}
                <Text style={formStyles.label}>Password</Text>
                <TextInput
                    style={formStyles.input}
                    placeholder="********"
                    placeholderTextColor="#A9A9A9"
                    secureTextEntry
                    value={password}
                    onChangeText={val => setPassword(val)}
                    autoCapitalize="none"
                />
                {errors.password && (
                    <View style={formStyles.errorContainer}>
                        <CircleAlert size={15} color="white" />
                        <Text style={formStyles.errorText}>{errors.password}</Text>
                    </View>
                )}
                {/* <Button title="Login" /> */}
                <Button title="Login" onPress={onSubmit} />
                
                <Link style={formStyles.forgotPassword} href="/(tabs)">Forgot Password</Link>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
        backgroundImage: '',
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    
});

const brandingStyles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const formStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        gap: 2,
    },
    title: {
        paddingBottom: 24,
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        width: '100%',
    },
    button: {
        borderRadius: 50,
    },
    forgotPassword: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
    },
    errorContainer: {
        flexDirection: 'row',
        backgroundColor: 'red',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 50,
        marginVertical: 5,
    },
    errorText: {
        flex: 2,
        color: 'white',
        paddingHorizontal: 5,
    },
})