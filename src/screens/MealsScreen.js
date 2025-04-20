import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMeals } from '../api/api';
import MealGrid from '../components/MealGrid';

export default function MealsScreen({ navigation, route }) {
  const categoryId = route.params.categoryId;
  const categoryName = route.params.categoryName;

  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Yenileme durumu

  useEffect(() => {
    navigation.setOptions({ title: categoryName });
  }, [navigation, categoryId]);

  const fetchMeals = async () => {
    try {
      const fetchedMeals = await getMeals(categoryId);
      setMeals(fetchedMeals.filter((i) => i.status));
      setLoading(false);
    } catch (error) {
      Alert.alert('Hata', 'Yemekler getirilirken bir hata oluştu.', [{ text: 'Tamam' }]);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeals();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  function renderMealItem(meal) {
    function pressHandler() {
      navigation.navigate('Yemek Detay', {
        mealId: meal.item.id,
        mealName: meal.item.name,
      });
    }
    return meal.item.status ? <MealGrid item={meal.item} pressMeal={pressHandler} /> : null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 10 }}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderMealItem}
        refreshing={refreshing} // Yenileme durumu
        onRefresh={onRefresh} // Yenileme fonksiyonu
      />
    </View>
  );
}

const styles = StyleSheet.create({});
