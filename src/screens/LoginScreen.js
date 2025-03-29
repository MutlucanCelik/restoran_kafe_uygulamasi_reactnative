import React, { useState, useEffect, useContext} from 'react';
import { Alert, TouchableOpacity, Image, Pressable, SafeAreaView, StyleSheet, ActivityIndicator, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../api/api';
import { getCompanyImage } from '../api/api';
import axios from 'axios';
import { UserContext } from '../api/contextApi';



export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [logo, setLogo] = useState('');
    const { updateUser } = useContext(UserContext);

    useEffect(() => {
        const fetchCompanyImage = async () => {
            try {
                const { image } = await getCompanyImage();
                setLogo(image);
                setLoading(false);
            } catch (error) {
                console.error('Şirketin resmini çekerken bir hata oluştu:', error);
                setLoading(false);
            }
        };
        fetchCompanyImage();
    }, []);

    const handleLogin = async () => {
      setLoading(true);
      try {
          const response = await axios.post(`${BASE_URL}api/auth/login`, {
              login,
              password,
          });
          setLogin('');
          setPassword('');
          setLoading(false);
          if (response.data.token) {
              if(response.data.user.role_id == 1){
                Alert.alert('Uyarı', 'Admin yetkili buradan giriş yapamaz.',[{ text: 'Tamam' }]);
              }else if(!response.data.user.status){
                Alert.alert('Uyarı', 'Hesabınız yetkili tarafından pasiflenmiştir.',[{ text: 'Tamam' }]);
              }else{
                const userInfo ={
                  id:response.data.user.id,
                  user_name:response.data.user.user_name,
                  name:response.data.user.name,
                  email:response.data.user.email
                }
                updateUser(userInfo);
                navigation.navigate('Drawer');
              }
              
          } else {
              Alert.alert('Hata', 'Beklenmedik bir sorun oluştu',[{ text: 'Tamam' }]);
          }
      } catch (error) {
          Alert.alert('Uyarı','Bilgileriniz uyuşmuyor',[{ text: 'Tamam' }]);
          setLoading(false);

      }
  };

    function register() {
        navigation.navigate('Register');
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={{ uri: BASE_URL + logo }} style={styles.image} />
            <Text style={styles.title}>GİRİŞ</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder='Email veya kullanıcı adı'
                    value={login}
                    onChangeText={setLogin}
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
            <TouchableOpacity onPress={register} style={styles.rememberView}>
                <Text style={styles.forgetText}>Hala kayıt olmadınız mı ?</Text>
            </TouchableOpacity>

            <View style={styles.buttonView}>
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Giriş</Text>
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
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        resizeMode: 'cover'
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
        paddingHorizontal: 40
    },
})
