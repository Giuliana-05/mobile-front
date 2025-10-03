// Arquivo: app/(tabs)/perfil.tsx (ou onde estiver seu perfil)

import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Text, Title } from "react-native-paper";
import { authService } from '../../services/api.js'; 

interface UserData {
    name: string;
    email: string;
}

export default function Perfil() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserData = useCallback(async () => {
        setLoading(true);
        try {
            const user = await authService.getLoggedInUser(); 
            
            if (user && user.name && user.email) {
                setUserData(user);
            } else {
                // Se não encontrar dados válidos, força o login
                await authService.logout();
                router.replace("/");
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            await authService.logout();
            router.replace("/");
        } finally {
             setLoading(false);
        }
    }, [router]);

    // Recarrega os dados do usuário sempre que a tela é focada
    useFocusEffect(
        useCallback(() => {
            loadUserData();
            return () => {}; 
        }, [loadUserData])
    );
    
    async function handleLogout() {
        await authService.logout();
        router.replace("/");
    }

    if (loading || !userData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a0dad" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Title style={styles.title}>Perfil do Usuário</Title>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.value}>{userData.name}</Text> 
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userData.email}</Text>
            </View>

            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                contentStyle={{ paddingVertical: 5 }}
            >
                Sair
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        backgroundColor: "#f9f6ff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f6ff",
    },
    loadingText: {
        fontSize: 16,
        color: "#6a0dad",
        marginTop: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#6a0dad",
        marginBottom: 40,
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
        marginBottom: 5,
    },
    value: {
        fontSize: 22,
        color: "#000",
        marginBottom: 10,
    },
    button: {
        marginTop: 40,
        borderRadius: 30,
        width: "100%",
        maxWidth: 300,
        backgroundColor: "#6a0dad",
        elevation: 5,
    },
});