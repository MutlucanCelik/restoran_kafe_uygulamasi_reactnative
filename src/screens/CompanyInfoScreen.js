import { StyleSheet, Text, View,ActivityIndicator,Image } from "react-native";
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, getCompanyInfo } from "../api/api";

export default function CompanyInfoScreen() {
    const [loading, setLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState([]);
    const fetchCompanyInfo = async () => {
        try {
          const fetchedCompanyInfo = await getCompanyInfo();

          setCompanyInfo(fetchedCompanyInfo);
          setLoading(false);
        } catch (error) {
          Alert.alert(
            'Hata',
            'Şirket bilgisini çekerken bir hata oluştu',
            [{ text: 'Tamam' }])
          setLoading(false);
        }
      };
      useEffect(() => {
        fetchCompanyInfo();
      }, []);
    
      useFocusEffect(
        React.useCallback(() => {
          fetchCompanyInfo();
          return () => {
          };
        }, [])
      );

      if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000FF" />
          </View>
        );
      }
    
  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
                <Image source={{ uri: BASE_URL + companyInfo.image }} style={styles.image} />
            </View>
      <View style={styles.group}>
        <Text style={styles.textHead}>Şirket adı</Text>
        <Text style={styles.text}>{companyInfo.company_name}</Text>
      </View>
      <View style={styles.group}>
        <Text style={styles.textHead}>Şirket bilgisi</Text>
        <Text style={styles.text}>{companyInfo.info}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    gap: 30,
  },
  textHead: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 16,
    letterSpacing: 1,
  },
  group: {
    gap: 5,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 110, // Yuvarlak container
    alignSelf: "center",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Beyaz arka plan
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Android için gölge
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: "cover",
  },
});

