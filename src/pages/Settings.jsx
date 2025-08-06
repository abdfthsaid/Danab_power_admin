import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faCog, 
  faEye, 
  faEyeSlash,
  faSave,
  faTimes,
  faCheck,
  faExclamationTriangle,
  faKey,
  faPalette,
  faLanguage,
  faClock,
  faTrash,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import { isAdmin } from '../utils/roleUtils';

const Settings = () => {
  const { user, logout } = useAuth();
  const { dark, setDark } = useDarkMode();
  const { t, language, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: language,
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    autoLogout: 30
  });

  const userIsAdmin = isAdmin(user);

  const tabs = [
    { id: 'preferences', label: t('systemPreferences'), icon: faCog },
    { id: 'security', label: t('securitySettings'), icon: faShieldAlt }
  ];

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') });
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: t('passwordUpdatedSuccess') });
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToUpdatePassword') });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setSystemPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    // If language is changed, update the system language
    if (key === 'language') {
      changeLanguage(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('deleteAccountConfirm'))) {
      // Handle account deletion
      logout();
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">{t('profileAndSettings')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('manageProfileAndSettings')}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            userIsAdmin 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {userIsAdmin ? t('administrator') : t('regularUser')}
          </span>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheck : faExclamationTriangle} />
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-300">
            <div className="p-6">
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h4 className="text-xl font-semibold dark:text-white mb-6">{t('securitySettings')}</h4>
                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('currentPassword')}
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faKey} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={t('enterCurrentPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                          >
                            <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('newPassword')}
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faKey} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={t('enterNewPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                          >
                            <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('confirmNewPassword')}
                        </label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faKey} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={t('confirmNewPasswordPlaceholder')}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                          >
                            <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {loading ? (
                          <span>{t('loading')}</span>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            {t('updatePassword')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Account Actions */}
                  <div className="mt-8 pt-6 border-t dark:border-gray-700">
                    <h5 className="text-lg font-medium dark:text-white mb-4">{t('accountActions')}</h5>
                    <div className="space-y-3">
                      <button
                        onClick={handleLogout}
                        className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                      >
                        {t('signOut')}
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        {t('deleteAccount')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h4 className="text-xl font-semibold dark:text-white mb-6">{t('systemPreferences')}</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('language')}
                      </label>
                      <select
                        value={systemPreferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="so">Somali / Soomaali</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('theme')}
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setDark(false)}
                          className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                            !dark
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={faSun} className="mr-2" />
                          {t('light')}
                        </button>
                        <button
                          onClick={() => setDark(true)}
                          className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                            dark
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={faPalette} className="mr-2" />
                          {t('dark')}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('timezone')}
                      </label>
                      <select
                        value={systemPreferences.timezone}
                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="UTC">{t('utc')}</option>
                        <option value="EAT">{t('eat')}</option>
                        <option value="GMT">{t('gmt')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dateFormat')}
                      </label>
                      <select
                        value={systemPreferences.dateFormat}
                        onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="MM/DD/YYYY">{t('mmddyyyy')}</option>
                        <option value="DD/MM/YYYY">{t('ddmmyyyy')}</option>
                        <option value="YYYY-MM-DD">{t('yyyymmdd')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('timeFormat')}
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="12h"
                            checked={systemPreferences.timeFormat === '12h'}
                            onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                            className="mr-2"
                          />
                          <span className="dark:text-white">{t('hour12')}</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="24h"
                            checked={systemPreferences.timeFormat === '24h'}
                            onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                            className="mr-2"
                          />
                          <span className="dark:text-white">{t('hour24')}</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('autoLogout')}
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={systemPreferences.autoLogout}
                        onChange={(e) => handlePreferenceChange('autoLogout', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 