import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    // Profile Info
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe123',
    bio: 'Frontend developer passionate about creating beautiful user experiences',
    avatar: 'https://via.placeholder.com/150',
    
    // Account Settings
    language: 'english',
    timezone: 'UTC-5',
    twoFactorAuth: false,
    emailNotifications: true,
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState({});
  const [notification, setNotification] = useState(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (section) => {
    // Simulate API call
    setNotification({
      type: 'success',
      message: `${section} updated successfully!`
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const tabVariants = {
    inactive: { scale: 1 },
    active: { 
      scale: 1.05,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-50 to-gray-100 py-8 px-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg ${
                notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl shadow-sm">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              variants={tabVariants}
              animate={activeTab === tab.id ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <motion.div variants={itemVariants} className="flex items-center space-x-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <img
                      src={userInfo.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                    >
                      📷
                    </motion.button>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{userInfo.name}</h2>
                    <p className="text-gray-500">{userInfo.email}</p>
                  </div>
                </motion.div>

                {/* Profile Fields */}
                {['name', 'email', 'username', 'bio'].map(field => (
                  <motion.div key={field} variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field}
                    </label>
                    <div className="flex items-center space-x-2">
                      {isEditing[field] ? (
                        <motion.input
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          type="text"
                          name={field}
                          value={userInfo[field]}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <p className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                          {userInfo[field]}
                        </p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleEdit(field)}
                        className="p-2 text-gray-500 hover:text-blue-500 rounded-lg"
                      >
                        {isEditing[field] ? '💾' : '✏️'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSave('Profile')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  Save Profile Changes
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Language Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <select
                    name="language"
                    value={userInfo.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                  </select>
                </motion.div>

                {/* Timezone */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    name="timezone"
                    value={userInfo.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                  </select>
                </motion.div>

                {/* Toggle Settings */}
                {['twoFactorAuth', 'emailNotifications'].map(setting => (
                  <motion.div
                    key={setting}
                    variants={itemVariants}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">
                        {setting.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {setting === 'twoFactorAuth' 
                          ? 'Add an extra layer of security to your account'
                          : 'Receive email updates about your account'}
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setUserInfo(prev => ({
                        ...prev,
                        [setting]: !prev[setting]
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        userInfo[setting] ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        layout
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          userInfo[setting] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </motion.button>
                  </motion.div>
                ))}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSave('Account settings')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium"
                >
                  Save Account Settings
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Password Fields */}
                {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
                  <motion.div key={field} variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="password"
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    />
                  </motion.div>
                ))}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSave('Password')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium"
                >
                  Update Password
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Setting;