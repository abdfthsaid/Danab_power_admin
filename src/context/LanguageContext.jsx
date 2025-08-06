import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    stations: 'Stations',
    slots: 'Slot Management',
    revenue: 'Revenue Analytics',
    users: 'Users',
    settings: 'Profile & Settings',
    notifications: 'Notifications',
    powerbanks: 'Power Banks',
    rentals: 'Active Rentals',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search...',
    refresh: 'Refresh',
    viewAll: 'View All',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    close: 'Close',
    submit: 'Submit',
    reset: 'Reset',
    update: 'Update',
    create: 'Create',
    remove: 'Remove',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    results: 'results',
    tips: 'tips',
    
    // Settings
    profileAndSettings: 'Profile & Settings',
    manageProfileAndSettings: 'Manage your profile and system settings',
    administrator: 'Administrator',
    regularUser: 'Regular User',
    securitySettings: 'Security Settings',
    systemPreferences: 'System Preferences',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    accountActions: 'Account Actions',
    enterCurrentPassword: 'Enter current password',
    enterNewPassword: 'Enter new password',
    confirmNewPasswordPlaceholder: 'Confirm new password',
    
    // Preferences
    language: 'Language',
    theme: 'Theme',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    timeFormat: 'Time Format',
    autoLogout: 'Auto Logout (minutes)',
    light: 'Light',
    dark: 'Dark',
    hour12: '12-hour',
    hour24: '24-hour',
    
    // Messages
    profileUpdatedSuccess: 'Profile updated successfully!',
    passwordUpdatedSuccess: 'Password updated successfully!',
    failedToUpdateProfile: 'Failed to update profile. Please try again.',
    failedToUpdatePassword: 'Failed to update password. Please try again.',
    passwordsDoNotMatch: 'New passwords do not match!',
    deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    operationSuccess: 'Operation completed successfully!',
    operationFailed: 'Operation failed. Please try again.',
    noDataFound: 'No data found',
    errorOccurred: 'An error occurred',
    
    // Timezones
    utc: 'UTC',
    eat: 'East Africa Time (EAT)',
    gmt: 'GMT',
    
    // Date Formats
    mmddyyyy: 'MM/DD/YYYY',
    ddmmyyyy: 'DD/MM/YYYY',
    yyyymmdd: 'YYYY-MM-DD',
    
    // Dashboard
    totalRevenue: 'Total Revenue',
    totalStations: 'Total Stations',
    totalUsers: 'Total Users',
    totalTransactions: 'Total Transactions',
    recentActivity: 'Recent Activity',
    quickStats: 'Quick Stats',
    overview: 'Overview',
    
    // Stations
    stationName: 'Station Name',
    stationLocation: 'Station Location',
    stationStatus: 'Station Status',
    addStation: 'Add Station',
    editStation: 'Edit Station',
    stationDetails: 'Station Details',
    activeStations: 'Active Stations',
    inactiveStations: 'Inactive Stations',
    
    // Users
    username: 'Username',
    email: 'Email',
    fullName: 'Full Name',
    role: 'Role',
    status: 'Status',
    addUser: 'Add User',
    editUser: 'Edit User',
    userDetails: 'User Details',
    activeUsers: 'Active Users',
    inactiveUsers: 'Inactive Users',
    
    // Forms
    required: 'Required',
    optional: 'Optional',
    invalidInput: 'Invalid input',
    pleaseWait: 'Please wait...',
    processing: 'Processing...',
    uploading: 'Uploading...',
    downloading: 'Downloading...',
    
    // Actions
    view: 'View',
    details: 'Details',
    actions: 'Actions',
    more: 'More',
    less: 'Less',
    expand: 'Expand',
    collapse: 'Collapse',
    show: 'Show',
    hide: 'Hide',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    share: 'Share',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  },
  so: {
    // Navigation
    dashboard: 'Dashboard',
    stations: 'Salalada',
    slots: 'Maamulka Slotka',
    revenue: 'Falanqaynta Dakhliga',
    users: 'Isticmaalayaal',
    settings: 'Profile & Settings',
    notifications: 'Ogeysiino',
    powerbanks: 'Batariyada',
    rentals: 'Kirada Firfircoon',
    
    // Common
    loading: 'Waa la soo dejiyaa...',
    save: 'Kaydi',
    cancel: 'Jooji',
    delete: 'Tir',
    edit: 'Wax ka beddel',
    add: 'Ku dar',
    search: 'Raadi...',
    refresh: 'Cusboonaysi',
    viewAll: 'Eeg Dhammaan',
    signOut: 'Ka bix',
    deleteAccount: 'Tir Accountka',
    close: 'Xir',
    submit: 'Dir',
    reset: 'Dib u deji',
    update: 'Cusboonaysi',
    create: 'Samee',
    remove: 'Ka saar',
    confirm: 'Xaqiiji',
    back: 'Dib u noqo',
    next: 'Xiga',
    previous: 'Hore',
    finish: 'Dhammee',
    results: 'natiijooyin',
    tips: 'tilmaamo',
    
    // Settings
    profileAndSettings: 'Profile & Settings',
    manageProfileAndSettings: 'Maamul profilekaaga iyo settingska nidaamka',
    administrator: 'Maamulaha',
    regularUser: 'Isticmaalaha Caadiga ah',
    securitySettings: 'Settingska Amniga',
    systemPreferences: 'Doorashooyinka Nidaamka',
    currentPassword: 'Furaha Hadda',
    newPassword: 'Furaha Cusub',
    confirmNewPassword: 'Xaqiiji Furaha Cusub',
    updatePassword: 'Cusboonaysi Furaha',
    accountActions: 'Ficilada Accountka',
    enterCurrentPassword: 'Geli furaha hadda',
    enterNewPassword: 'Geli furaha cusub',
    confirmNewPasswordPlaceholder: 'Xaqiiji furaha cusub',
    
    // Preferences
    language: 'Luqadda',
    theme: 'Midabka',
    timezone: 'Wakhtiga',
    dateFormat: 'Habka Taariikhda',
    timeFormat: 'Habka Wakhtiga',
    autoLogout: 'Si toos ah uga bixid (daqiiqado)',
    light: 'Iftiinka',
    dark: 'Mugdiga',
    hour12: '12-saac',
    hour24: '24-saac',
    
    // Messages
    profileUpdatedSuccess: 'Profileka waa la cusboonaysiiyay!',
    passwordUpdatedSuccess: 'Furaha waa la cusboonaysiiyay!',
    failedToUpdateProfile: 'Khalad ayaa ka dhacay cusboonaysinta profileka. Fadlan isku day mar kale.',
    failedToUpdatePassword: 'Khalad ayaa ka dhacay cusboonaysinta furaha. Fadlan isku day mar kale.',
    passwordsDoNotMatch: 'Furaha cusub ma isku mid aha!',
    deleteAccountConfirm: 'Ma hubtaa in aad rabto inaad tirtay accountkaaga? Tani waxay noqon doontaa mid aan la soo noqon karin.',
    operationSuccess: 'Ficilka waa la dhammeeyay!',
    operationFailed: 'Ficilka waa fashilantay. Fadlan isku day mar kale.',
    noDataFound: 'Wax data ah lama helin',
    errorOccurred: 'Khalad ayaa ka dhacay',
    
    // Timezones
    utc: 'UTC',
    eat: 'Wakhtiga Bariga Afrika (EAT)',
    gmt: 'GMT',
    
    // Date Formats
    mmddyyyy: 'BB/DD/SSSS',
    ddmmyyyy: 'DD/BB/SSSS',
    yyyymmdd: 'SSSS-BB-DD',
    
    // Dashboard
    totalRevenue: 'Wadarta Dakhliga',
    totalStations: 'Wadarta Salalada',
    totalUsers: 'Wadarta Isticmaalayaal',
    totalTransactions: 'Wadarta Ganacsiga',
    recentActivity: 'Dhaqdhaqaaqa Dhow',
    quickStats: 'Tirakoobka Degdeg',
    overview: 'Dulmar',
    
    // Stations
    stationName: 'Magaca Salalada',
    stationLocation: 'Goobta Salalada',
    stationStatus: 'Xaalada Salalada',
    addStation: 'Ku dar Salalada',
    editStation: 'Wax ka beddel Salalada',
    stationDetails: 'Faahfaahinta Salalada',
    activeStations: 'Salalada Firfircoon',
    inactiveStations: 'Salalada aan Firfircoonayn',
    
    // Users
    username: 'Magaca Isticmaalaha',
    email: 'Emailka',
    fullName: 'Magaca Buuxa',
    role: 'Jago',
    status: 'Xaalada',
    addUser: 'Ku dar Isticmaalaha',
    editUser: 'Wax ka beddel Isticmaalaha',
    userDetails: 'Faahfaahinta Isticmaalaha',
    activeUsers: 'Isticmaalayaal Firfircoon',
    inactiveUsers: 'Isticmaalayaal aan Firfircoonayn',
    
    // Forms
    required: 'Loo baahan yahay',
    optional: 'Ikhtiyaari ah',
    invalidInput: 'Geli khaldan',
    pleaseWait: 'Fadlan sug...',
    processing: 'Waa la habeynayaa...',
    uploading: 'Waa la soo dejinayaa...',
    downloading: 'Waa la soo dejinayaa...',
    
    // Actions
    view: 'Eeg',
    details: 'Faahfaahin',
    actions: 'Ficilada',
    more: 'Wax dheeraad ah',
    less: 'Ka yar',
    expand: 'Fid',
    collapse: 'Jab',
    show: 'Muuji',
    hide: 'Qari',
    filter: 'Shaqsi',
    sort: 'Kala saar',
    export: 'Soo saar',
    import: 'Soo deji',
    print: 'Print',
    share: 'Wadaag',
    
    // Status
    active: 'Firfircoon',
    inactive: 'Aan Firfircoonayn',
    pending: 'Cusub',
    completed: 'La dhammeeyay',
    failed: 'Fashilantay',
    success: 'Guul',
    error: 'Khalad',
    warning: 'Digniin',
    info: 'Macluumaad'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    return localStorage.getItem('systemLanguage') || 'en';
  });

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('systemLanguage', newLanguage);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language: newLanguage } 
    }));
  };

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const newLanguage = event.detail.language;
      if (newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 