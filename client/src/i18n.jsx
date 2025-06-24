// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      searchLabel: 'Search Disease by Name',
      symptoms: 'Symptoms',
      noResults: 'No diseases found.',
      sortBy: 'Sort By',
      nameAsc: 'Name (A-Z)',
      nameDesc: 'Name (Z-A)',
      symptomAsc: 'Fewest Symptoms',
      symptomDesc: 'Most Symptoms',
      filterBySymptom: 'Filter by Symptom',
    },
  },
  hi: {
    translation: {
      searchLabel: 'रोग का नाम खोजें',
      symptoms: 'लक्षण',
      noResults: 'कोई रोग नहीं मिला।',
      sortBy: 'क्रमबद्ध करें',
      nameAsc: 'नाम (A-Z)',
      nameDesc: 'नाम (Z-A)',
      symptomAsc: 'कम लक्षण',
      symptomDesc: 'अधिक लक्षण',
      filterBySymptom: 'लक्षण द्वारा फ़िल्टर करें',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
