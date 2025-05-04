import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Profile</Text>
                <Text style={styles.optionDescription}>Manage your profile information</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Security</Text>
                <Text style={styles.optionDescription}>Password and authentication</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Notifications</Text>
                <Text style={styles.optionDescription}>Manage notification preferences</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.optionsList}>
            <View style={styles.switchItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Dark Mode</Text>
                <Text style={styles.optionDescription}>Switch between light and dark themes</Text>
              </View>
              <Switch 
                trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor="#CBD5E1"
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Push Notifications</Text>
                <Text style={styles.optionDescription}>Receive push notifications</Text>
              </View>
              <Switch 
                trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor="#CBD5E1"
                value={true}
              />
            </View>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Language</Text>
                <Text style={styles.optionDescription}>Change app language</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>English</Text>
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Help Center</Text>
                <Text style={styles.optionDescription}>Get help with app features</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Contact Support</Text>
                <Text style={styles.optionDescription}>Reach out to our support team</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  logoutButton: {
    marginVertical: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});