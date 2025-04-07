import React, { useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Image, Pressable, SafeAreaView, StyleSheet, ActivityIndicator, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../api/api';
import { getCompanyImage } from '../api/api';
import axios from 'axios';


export default function RegisterScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [user_name, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleRegister = async () => {
      setLoading(true);
      try {
        console.log( name,
            user_name,
            email,
            password)
          const response = await axios.post(`${BASE_URL}api/auth/register`, {
              name,
              user_name,
              email,
              password,
          });
          setName('');
          setUserName('');
          setEmail('');
          setPassword('');
          setLoading(false);
          if (response.data.token) {
              Alert.alert('Başarılı', 'Başarıyla kayıt olundu.',[{ text: 'Tamam' }]);
              navigation.navigate('Login');
          } else {
              // Hatalı giriş
              Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı.',[{ text: 'Tamam' }]);
          }
      } catch (error) {
          Alert.alert('Uyarı','Beklenmedin bir sorun oluştu.',[{ text: 'Tamam' }]);
          setLoading(false);

      }
  };


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <View style={styles.inputView}>
            <TextInput
                    style={styles.input}
                    placeholder='Ad soyad'
                    value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                 <TextInput
                    style={styles.input}
                    placeholder='Kullanıcı adı'
                    value={user_name}
                    onChangeText={setUserName}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifre'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
            </View>


            <View style={styles.buttonView}>
                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "#14213d"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 7
    },
    rememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: 'flex-end',
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 15,
    },
    forgetText: {
        fontSize: 11,
        color: "blue"
    },
    button: {
        backgroundColor: "#ef233c",
        height: 45,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 40,
        marginTop:20
        
    },
})
