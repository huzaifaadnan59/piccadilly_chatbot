import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import ChatBot from '@/components/ChatBot';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Clock, Phone } from 'lucide-react-native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://www.piccadilly.com/wp-content/themes/piccadilly2020/images/piccadilly-logo-white.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroSubtitle}>Southern Hospitality Since 1944</Text>
        </View>

        <View style={styles.quickInfoSection}>
          <TouchableOpacity style={styles.infoCard}>
            <MapPin size={24} color="#006B3F" />
            <Text style={styles.infoTitle}>Find Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoCard}>
            <Clock size={24} color="#006B3F" />
            <Text style={styles.infoTitle}>Hours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoCard}>
            <Phone size={24} color="#006B3F" />
            <Text style={styles.infoTitle}>Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Menu Items</Text>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg' }} 
                style={styles.cardImage} 
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Famous Fried Chicken</Text>
                <Text style={styles.cardText}>Our signature dish, perfectly seasoned and crispy</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg' }} 
                style={styles.cardImage} 
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Carved Roast Beef</Text>
                <Text style={styles.cardText}>Tender, juicy, and hand-carved to perfection</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/5966431/pexels-photo-5966431.jpeg' }} 
                style={styles.cardImage} 
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Fresh Vegetables</Text>
                <Text style={styles.cardText}>Farm-fresh vegetables prepared daily</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesContainer}>
            <TouchableOpacity style={styles.serviceCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg' }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceTitle}>Catering</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg' }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceTitle}>Private Events</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Piccadilly</Text>
          <Text style={styles.paragraph}>
            Since 1944, Piccadilly has been serving fresh, homestyle meals that bring
            families and communities together. Our commitment to quality ingredients,
            traditional Southern recipes, and warm hospitality continues to make us
            a beloved destination for generations of diners.
          </Text>
          <Text style={styles.paragraph}>
            Every day, we prepare our meals from scratch using time-honored recipes
            and fresh ingredients. From our famous fried chicken to our hand-carved
            roast beef and fresh vegetables, every dish is crafted with care and
            served with Southern hospitality.
          </Text>
        </View>
      </ScrollView>
      
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 32,
    backgroundColor: '#006B3F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickInfoSection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    alignItems: 'center',
    padding: 12,
  },
  infoTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  section: {
    padding: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#006B3F',
    marginBottom: 16,
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    padding: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 16,
  },
});