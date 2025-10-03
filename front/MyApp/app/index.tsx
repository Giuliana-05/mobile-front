import { useRouter } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, Title } from "react-native-paper";
import { authService } from '../services/api.js';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() { 
        if (email && password) {
            try {
                const response = await authService.login(email, password); // Chama o Back End e salva o token
                
                if (response && response.token) {
                    router.replace("/(tabs)/noticias"); // Usa replace para não voltar para a tela de login
                } else {
                    // Isso só deve ocorrer se o servidor responder inesperadamente
                    alert("Resposta inesperada do servidor.");
                }
            } catch (error: any) { // <-- CORREÇÃO APLICADA AQUI
                // COMENTÁRIO: Trata falha na autenticação (email/senha errados)
                alert(`Falha no Login: ${error.message}`);
            }
        } else {
            alert("Preencha email e senha!");
        }
    }

    function handleCadastro() {
        router.push("/cadastro");
    }

    return (
        <View style={styles.container}>
            {/* Logo ou ícone do app */}
            <Image
                source={ require('../assets/images/provisoria.png')}
                style={styles.logo}
            />

            <Title style={styles.title}>Bem-vindo</Title>
            <Text style={styles.subtitle}>Entre para ver as últimas notícias</Text>

            <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                label="Senha"
                mode="outlined"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <Text style={styles.forgot}>Esqueceu a senha?</Text>

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                contentStyle={{ paddingVertical: 5 }}
            >
                Entrar
            </Button>

            <Button
                mode="text"
                onPress={handleCadastro}
                labelStyle={{ color: "#6a0dad", fontWeight: "bold" }}
                style={styles.register}
            >
                Criar conta
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 20, 
        backgroundColor: "#ffffff" 
    },
    logo: { 
        width: 80, 
        height: 80, 
        marginBottom: 20 
    },
    title: { 
        fontSize: 26, 
        fontWeight: "bold", 
        marginBottom: 5, 
        textAlign: "center", 
        color: "#6a0dad" 
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 30,
        textAlign: "center"
    },
    input: { 
        width: "100%", 
        marginBottom: 15 
    },
    forgot: { 
        marginTop: 5, 
        color: "#6a0dad", 
        alignSelf: "flex-end" 
    },
    button: { 
        marginTop: 20, 
        borderRadius: 30, 
        width: "100%", 
        backgroundColor: "#6a0dad" 
    },
    register: {
        marginTop: 15
    }
});