import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');
const LEVELS_PER_ROW = 5;
const LEVEL_BUTTON_SIZE = (width - 80) / LEVELS_PER_ROW;

export default function LevelSelectScreen({ navigation }) {
  const { state } = useGame();

  const getLevelButtonStyle = (level) => {
    if (level <= state.unlockedLevels) {
      if (level === state.currentLevel) {
         return [styles.levelButton, styles.currentLevel];
     } else if (level < state.currentLevel) {
       return [styles.levelButton, styles.completedLevel];
     } else {
       return [styles.levelButton, styles.unlockedLevel];
     }
   } else {
     return [styles.levelButton, styles.lockedLevel];
   }
 };

 const getLevelTextStyle = (level) => {
   if (level <= state.unlockedLevels) {
     return styles.levelText;
   } else {
     return [styles.levelText, styles.lockedText];
   }
 };

 const handleLevelPress = (level) => {
   if (level <= state.unlockedLevels) {
     navigation.navigate('Game', { level });
   }
 };

 const isBossLevel = (level) => {
   return level % 25 === 0;
 };

 const getLevelIcon = (level) => {
   if (level > state.unlockedLevels) return '🔒';
   if (level < state.currentLevel) return '✅';
   if (level === state.currentLevel) return '🎯';
   if (isBossLevel(level)) return '👑';
   return level.toString();
 };

 const renderLevelSection = (startLevel, endLevel, title) => {
   const levels = [];
   for (let i = startLevel; i <= endLevel; i++) {
     levels.push(i);
   }

   const rows = [];
   for (let i = 0; i < levels.length; i += LEVELS_PER_ROW) {
     rows.push(levels.slice(i, i + LEVELS_PER_ROW));
   }

   return (
     <View style={styles.section}>
       <Text style={styles.sectionTitle}>{title}</Text>
       {rows.map((row, rowIndex) => (
         <View key={rowIndex} style={styles.levelRow}>
           {row.map((level) => (
             <TouchableOpacity
               key={level}
               style={getLevelButtonStyle(level)}
               onPress={() => handleLevelPress(level)}
               disabled={level > state.unlockedLevels}
             >
               <Text style={getLevelTextStyle(level)}>
                 {getLevelIcon(level)}
               </Text>
               {isBossLevel(level) && level <= state.unlockedLevels && (
                 <Text style={styles.bossLabel}>BOSS</Text>
               )}
             </TouchableOpacity>
           ))}
         </View>
       ))}
     </View>
   );
 };

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.header}>
       <TouchableOpacity
         style={styles.backButton}
         onPress={() => navigation.goBack()}
       >
         <Text style={styles.backButtonText}>← Back</Text>
       </TouchableOpacity>
       <Text style={styles.title}>Level Select</Text>
       <View style={styles.placeholder} />
     </View>

     <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       {renderLevelSection(1, 10, 'Beginner (1-10)')}
       {renderLevelSection(11, 50, 'Intermediate (11-50)')}
       {renderLevelSection(51, 100, 'Advanced (51-100)')}
       {renderLevelSection(101, 200, 'Expert (101-200)')}

       <View style={styles.legend}>
         <Text style={styles.legendTitle}>Legend:</Text>
         <View style={styles.legendItem}>
           <View style={[styles.legendIcon, styles.currentLevel]}>
             <Text style={styles.legendText}>🎯</Text>
           </View>
           <Text style={styles.legendLabel}>Current Level</Text>
         </View>
         <View style={styles.legendItem}>
           <View style={[styles.legendIcon, styles.completedLevel]}>
             <Text style={styles.legendText}>✅</Text>
           </View>
           <Text style={styles.legendLabel}>Completed</Text>
         </View>
         <View style={styles.legendItem}>
           <View style={[styles.legendIcon, styles.unlockedLevel]}>
             <Text style={styles.legendText}>1</Text>
           </View>
           <Text style={styles.legendLabel}>Available</Text>
         </View>
         <View style={styles.legendItem}>
           <View style={[styles.legendIcon, styles.lockedLevel]}>
             <Text style={styles.legendText}>🔒</Text>
           </View>
           <Text style={styles.legendLabel}>Locked</Text>
         </View>
       </View>
     </ScrollView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#1a1a1a',
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   paddingHorizontal: 20,
   paddingVertical: 15,
   borderBottomWidth: 1,
   borderBottomColor: '#333',
 },
 backButton: {
   backgroundColor: '#333',
   paddingHorizontal: 15,
   paddingVertical: 8,
   borderRadius: 6,
 },
 backButtonText: {
   color: '#fff',
   fontSize: 14,
   fontWeight: 'bold',
 },
 title: {
   color: '#fff',
   fontSize: 20,
   fontWeight: 'bold',
 },
 placeholder: {
   width: 60,
 },
 scrollView: {
   flex: 1,
   paddingHorizontal: 20,
 },
 section: {
   marginVertical: 20,
 },
 sectionTitle: {
   color: '#fff',
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 15,
   textAlign: 'center',
 },
 levelRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 10,
 },
 levelButton: {
   width: LEVEL_BUTTON_SIZE,
   height: LEVEL_BUTTON_SIZE,
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
   borderWidth: 2,
 },
 currentLevel: {
   backgroundColor: '#007AFF',
   borderColor: '#fff',
 },
 completedLevel: {
   backgroundColor: '#32CD32',
   borderColor: '#228B22',
 },
 unlockedLevel: {
   backgroundColor: '#333',
   borderColor: '#555',
 },
 lockedLevel: {
   backgroundColor: '#222',
   borderColor: '#333',
 },
 levelText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
 lockedText: {
   color: '#666',
 },
 bossLabel: {
   color: '#FFD700',
   fontSize: 8,
   fontWeight: 'bold',
   marginTop: 2,
 },
 legend: {
   backgroundColor: '#2a2a2a',
   borderRadius: 10,
   padding: 20,
   marginBottom: 20,
 },
 legendTitle: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 15,
 },
 legendItem: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 10,
 },
 legendIcon: {
   width: 30,
   height: 30,
   borderRadius: 6,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 15,
   borderWidth: 1,
 },
 legendText: {
   fontSize: 12,
   fontWeight: 'bold',
 },
 legendLabel: {
   color: '#ccc',
   fontSize: 14,
 },
});