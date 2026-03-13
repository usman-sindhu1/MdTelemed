import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'nutrition', label: 'Nutrition Health' },
  { id: 'mental', label: 'Mental Health' },
];

const WELL_BEING_CARDS = [
  {
    id: '1',
    title: 'Mindfulness 101',
    description: '5 Minutes breathing excercise to reduce anxiety',
    descriptionLine1: '5 Minutes breathing',
    descriptionLine2: 'exercise to reduce anxiety',
    backgroundColor: '#2563EB8C',
    titleColor: '#FFFFFF',
    descriptionColor: '#FFFFFF',
    buttonLabel: 'Start Session',
    width: 340,
  },
  {
    id: '2',
    title: 'Mind',
    description: '5 Min exercise to relax',
    backgroundColor: '#ECF2FD',
    titleColor: '#1F2937',
    descriptionColor: '#757575',
    buttonLabel: 'Start Session',
  },
  {
    id: '3',
    title: 'Stress Relief',
    description: 'Quick relaxation techniques',
    backgroundColor: '#ECF2FD',
    titleColor: '#1F2937',
    descriptionColor: '#757575',
    buttonLabel: 'Start Session',
  },
];

const WellBeing: React.FC = () => {
  const [selectedTabId, setSelectedTabId] = useState('all');

  const handleViewAll = () => {
    // Navigate or expand - add as needed
  };

  const handleStartSession = (cardId: string) => {
    console.log('Start session:', cardId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Well Being</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        style={styles.tabsScroll}
      >
        {TABS.map((tab) => {
          const isSelected = selectedTabId === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isSelected ? styles.tabSelected : styles.tabUnselected,
              ]}
              onPress={() => setSelectedTabId(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isSelected ? styles.tabLabelSelected : styles.tabLabelUnselected,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
        style={styles.cardsScroll}
      >
        {WELL_BEING_CARDS.map((card) => {
          const hasTwoLineDescription = 'descriptionLine1' in card && 'descriptionLine2' in card;
          return (
            <View
              key={card.id}
              style={[
                styles.card,
                {
                  backgroundColor: card.backgroundColor,
                  width: card.width ?? CARD_WIDTH,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: card.titleColor }]}>
                {card.title}
              </Text>
              {hasTwoLineDescription ? (
                <View style={styles.cardRowDescriptionAndButton}>
                  <View style={styles.cardDescriptionLeft}>
                    <Text
                      style={[
                        styles.cardDescriptionTwoLines,
                        { color: card.descriptionColor },
                      ]}
                    >
                      {(card as { descriptionLine1: string }).descriptionLine1}
                    </Text>
                    <Text
                      style={[
                        styles.cardDescriptionTwoLines,
                        { color: card.descriptionColor },
                      ]}
                    >
                      {(card as { descriptionLine2: string }).descriptionLine2}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => handleStartSession(card.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>{card.buttonLabel}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.cardTextBlock}>
                    <Text
                      style={[styles.cardDescription, { color: card.descriptionColor }]}
                      numberOfLines={2}
                    >
                      {card.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => handleStartSession(card.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>{card.buttonLabel}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const CARD_WIDTH = 280;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary || '#2563EB',
  },
  tabsScroll: {
    marginHorizontal: -15,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tabSelected: {
    backgroundColor: Colors.primary || '#2563EB',
  },
  tabUnselected: {
    backgroundColor: '#ECF2FD',
  },
  tabLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelSelected: {
    color: '#FFFFFF',
  },
  tabLabelUnselected: {
    color: '#757575',
  },
  cardsScroll: {
    marginHorizontal: -15,
  },
  cardsContent: {
    paddingHorizontal: 15,
    paddingRight: 27,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 120,
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardRowDescriptionAndButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  cardDescriptionLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardDescriptionTwoLines: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  cardDescription: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    opacity: 0.95,
  },
  startButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginTop: 8,
  },
  startButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
});

export default WellBeing;
