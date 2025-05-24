import React, { useState,useContext } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { BASE_URL } from '../api/api';
import { UserContext } from '../api/contextApi';


const ReservationForm = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [numOfPeople, setNumOfPeople] = useState('');
  const { user } = useContext(UserContext);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDateTime(date);
    hideDatePicker();
  };

  const handleReservation = async () => {
    try {
      if (selectedDateTime && numOfPeople !== '') {
        const formattedDateTime = selectedDateTime.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

        const response = await axios.post(`${BASE_URL}api/create-reservation`, {
          user_id: user.id,
          date: formattedDateTime,
          number_of_people: numOfPeople,
        });
        Alert.alert(
            'Başarılı',
            'Rezervasyon başarıyla oluşturuldu. Rezervasyon durumunu Rezervasyonlarım sayfasından takip edebilirsiniz.',
            [{ text: 'Tamam' }]
          );
        setSelectedDateTime(null);
        setNumOfPeople('');
      } else {
        Alert.alert(
            'Uyarı',
            'Tüm alanları doldurun lütfen.',
            [{ text: 'Tamam' }])
      }
    } catch (error) {
        Alert.alert('Hata', 'Veriler gönderilirken bir sorun oluştu.',[{ text: 'Tamam' }]);
    }
  };

  return (
    <View style={styles.container}>
        <View style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:7}}>
           
            <Text style={styles.selectedDateTimeText} placeholder='Tarih'>
            { selectedDateTime ? selectedDateTime.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) : null}
            </Text>
             
            <Button title="Tarih" onPress={showDatePicker} />
        </View>
      
      
      <TextInput
        style={styles.input}
        placeholder="Kişi sayısı"
        keyboardType="numeric"
        value={numOfPeople}
        onChangeText={(text) => setNumOfPeople(text)}
      />
      <TouchableOpacity style={styles.button}onPress={handleReservation}>
        <Text style={styles.buttonText}>Rezervasyon Yap</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical:40,
    gap:20
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  selectedDateTimeText: {
    flex:1,
    fontSize: 18,
    fontWeight: 'bold',
    padding:5,
  },
  button:{
    backgroundColor:'#017BFE',
    width:'100%',
    padding:10,
    textAlign:'center',
    borderRadius:7
  },
  buttonText:{
    textAlign:'center',
    color:'#fff'
  }
});

export default ReservationForm;
