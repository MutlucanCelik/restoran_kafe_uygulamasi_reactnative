import React, { useState, useEffect,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../api/api';
import { UserContext } from '../api/contextApi';

const MessageScreen = () => {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // API'den option verilerini almak için bir istek yap
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/topics`);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        Alert.alert('Error', 'An error occurred while fetching options.');
      }
    };

    fetchOptions();
  }, []);

  const sendMessage = async () => {
    try {
      if(message && selectedOption){
        const response = await axios.post(`${BASE_URL}api/send-message`, {
          user_id: user.id,
          message: message,
          topic_id: selectedOption
        });
        
        if (response.data.message == 'success') {
          setMessage('');
          setSelectedOption('')
          Alert.alert(
            'Başarılı',
            'Mesajınız başarıyla gönderildi.',
            [{ text: 'Tamam' }]
          );      
        } else {
          Alert.alert(
            'Hata',
            'Beklenmedik bir sorun oluştu',
            [{ text: 'Tamam' }]
          );   
        }
      }else{
        Alert.alert(
          'Uyarı',
          'Tüm alanları doldurun lütfen.',
          [{ text: 'Tamam' }])
      }
    } catch (error) {
      Alert.alert(
        'Hata',
        'Beklenmedik bir sorun oluştu',
        [{ text: 'Tamam' }]
      );  
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yetkiliye Mesaj Gönder</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Konu</Text>
        <View style={styles.pickerContainer}>
            <Picker
            style={styles.picker}
            selectedValue={selectedOption}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedOption(itemValue)
            }>
            <Picker.Item label='Seçim yapın' value='' />
            {options.map((option, index) => (
                <Picker.Item key={index} label={option.name} value={option.id} />
            ))}
        </Picker>
        </View>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mesaj</Text>
        <TextInput
          style={styles.input}
          placeholder="Mesajınız..."
          multiline
          onChangeText={text => setMessage(text)}
          value={message}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    paddingHorizontal:40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button:{
    backgroundColor:'#017BFE',
    width:'100%',
    padding:8,
    textAlign:'center',
    borderRadius:7
  },
  buttonText:{
    textAlign:'center',
    color:'#fff'
  }
  
});

export default MessageScreen;
