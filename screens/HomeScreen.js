import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Button, Card, Image, Text } from '@rneui/themed';
import { AuthContext } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { fetchInvestments } from '../api';

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        const data = await fetchInvestments();
        setTransactions(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadInvestments();
    const intervalId = setInterval(loadInvestments, 5000); // fetch transactions every 5 seconds

    return () => clearInterval(intervalId); // cleanup the interval on component unmount
  }, []);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Invalid Date';
    const date = parseISO(isoString);
    return format(date, 'yyyy-MM-dd hh:mm:ss a');
  };

  const getTotalAmount = () => {
    return transactions.reduce((total, transaction) => {
      const amount = parseFloat(transaction.amount.replace(/[^\d.-]/g, ''));
      return total + amount;
    }, 0).toFixed(2);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };

  const TransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionAmount}>{formatCurrency(item.amount)}</Text>
      <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Image source={require('../assets/ensky_logo.png')} style={[styles.logo, { width: 'auto', height: 100 }]} />
      <View style={[styles.screen, { justifyContent: 'flex-start' }]}>
        <View style={styles.navigationMenu}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Button title='Home' containerStyle={styles.navigationItemContainer} titleStyle={styles.navigationItemButton}></Button>
            <Button title='Account' containerStyle={styles.navigationItemContainer} titleStyle={styles.navigationItemButton} type='clear'></Button>
            <Button title='Settings' containerStyle={styles.navigationItemContainer} titleStyle={styles.navigationItemButton} type='clear'></Button>
            <Button title='History' containerStyle={styles.navigationItemContainer} titleStyle={styles.navigationItemButton} type='clear'></Button>
            <Button title='Logout' containerStyle={styles.navigationItemContainer} titleStyle={styles.navigationItemButton} type='clear' onPress={handleLogout}></Button>
          </ScrollView>
        </View>
        <View style={styles.balanceCard}>
          <Card>
            <Text>Your Ensky fund balance is</Text>
            <Text h3>{formatCurrency(getTotalAmount())}</Text>
            <Button containerStyle={{ marginTop: 20 }} size="sm" title='Add funds'></Button>
          </Card>
        </View>
        <View style={styles.balanceCard}>
          <Card>
            <Text h4>Transactions</Text>
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <TransactionItem item={item} />}
            />
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  navigationMenu: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  navigationItemContainer: {
    borderRadius: 100,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  navigationItemButton: {
    fontSize: 14,
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  balanceCard: {
    width: '100%',
  },
  transactionItem: {
    marginTop: 10,
  },
  transactionAmount: {
    fontSize: 18,
    color: '#048410',
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
  },
});