import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GithubIcon, InstagramIcon, TwitterIcon } from 'lucide-react';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    // Personal Info
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+250 796 577 776',
    dateOfBirth: '1992-05-15',
    gender: 'female',
    
    // Profile
    username: 'sarah_j_92',
    displayName: 'Sarah J.',
    bio: 'Passionate photographer & coffee enthusiast. Love exploring new tech and reading sci-fi novels.',
    avatar: 'https://via.placeholder.com/150',
    coverPhoto: 'https://via.placeholder.com/1200x300',
    
    // Addresses
    addresses: [
      {
        id: 1,
        type: 'home',
        name: 'Home',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'Rwanda',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        name: 'Work',
        street: '456 Business Ave, Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'Rwanda',
        isDefault: false
      }
    ],
    
    // Payment Methods
    paymentMethods: [
      {
        id: 1,
        type: 'visa',
        last4: '4242',
        expDate: '05/25',
        cardholderName: 'Sarah Johnson',
        isDefault: true
      },
      {
        id: 2,
        type: 'mastercard',
        last4: '1234',
        expDate: '08/24',
        cardholderName: 'Sarah Johnson',
        isDefault: false
      }
    ],
    
    // Preferences
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: true,
      marketingEmails: false,
      twoFactorAuth: true,
      language: 'English',
      currency: 'USD',
      timezone: 'America/New_York'
    },
    
    // Social Links
    socialLinks: {
      twitter: '@sarah_j',
      instagram: '@sarah_photography',
    },
    
    // Account Security
    lastLogin: '2024-03-15T10:30:00',
    memberSince: '2023-01-20',
    accountStatus: 'active'
  });

  const [editedData, setEditedData] = useState({...userData});
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Rwanda'
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'personal', label: 'Personal Info', icon: '📋' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'payment', label: 'Payment Methods', icon: '💳' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    setUserData(editedData);
    setIsEditing(false);
    // Show success message (you can add a toast notification here)
  };

  const handleCancelEdit = () => {
    setEditedData({...userData});
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street) {
      const address = {
        ...newAddress,
        id: Date.now(),
        isDefault: userData.addresses.length === 0
      };
      setUserData(prev => ({
        ...prev,
        addresses: [...prev.addresses, address]
      }));
      setNewAddress({
        type: 'home',
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Rwanda'
      });
      setShowAddAddress(false);
    }
  };

  const setDefaultAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    }));
  };

  const deleteAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
  };

  const setDefaultPayment = (paymentId) => {
    setUserData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentId
      }))
    }));
  };

  const deletePaymentMethod = (paymentId) => {
    setUserData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(pm => pm.id !== paymentId)
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

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cover Photo & Avatar Section */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative h-64 md:h-80 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden"
      >
        
        {/* Avatar */}
        <motion.div 
          className="absolute -bottom-16 left-8 "
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <div className="relative">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={userData.avatar}
              alt={userData.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg"
            >
              📷
            </motion.button>
          </div>
        </motion.div>

        {/* Edit Cover Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="mt-20 absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>🖼️</span>
          <span>Change Cover</span>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Profile Header Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userData.displayName}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">👤</span> @{userData.username}
                </p>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📧</span> {userData.email}
                </p>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📅</span> Member since {new Date(userData.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isEditing 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                <Link to="/settings">
                  <span>{isEditing ? 'Directing to Settings' : 'Edit Profile'}</span>
                </Link>
              </motion.button>
              
              {isEditing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2"
                >
                  <span>✕</span>
                  <span>Cancel</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Bio */}
          <motion.p 
            className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg"
            whileHover={{ x: 5 }}
          >
            {userData.bio}
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm mb-6 overflow-x-auto"
        >
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Display Name', name: 'displayName', icon: '👤' },
                    { label: 'Username', name: 'username', icon: '🔗' },
                    { label: 'Email', name: 'email', icon: '📧', type: 'email' },
                    { label: 'Phone', name: 'phone', icon: '📞' }
                  ].map((field) => (
                    <motion.div key={field.name} variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <span className="mr-2">{field.icon}</span>
                        {field.label}
                      </label>
                      {isEditing ? (
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type={field.type || 'text'}
                          name={field.name}
                          value={editedData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                          {userData[field.name]}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bio Edit */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <span className="mr-2">📝</span> Bio
                  </label>
                  {isEditing ? (
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      name="bio"
                      value={editedData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                      {userData.bio}
                    </p>
                  )}
                </motion.div>

                {/* Social Links */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(userData.socialLinks).map(([platform, handle]) => (
                      <motion.div
                        key={platform}
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 p-4 rounded-xl text-center"
                      >
                        <span className="text-2xl mb-2 block">
                          {platform === 'twitter' && <TwitterIcon className="mx-auto h-6 w-6 text-blue-500" />}
                          {platform === 'instagram' && <InstagramIcon className="mx-auto h-6 w-6 text-pink-500" />}
                        </span>
                        <p className="text-sm font-medium text-gray-700 capitalize">{platform}</p>
                        <p className="text-sm text-gray-600">{handle}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', name: 'firstName', icon: '👤' },
                    { label: 'Last Name', name: 'lastName', icon: '👤' },
                    { label: 'Date of Birth', name: 'dateOfBirth', icon: '🎂', type: 'date' },
                    { 
                      label: 'Gender', 
                      name: 'gender', 
                      icon: '⚥',
                      type: 'select',
                      options: ['male', 'female', 'other', 'prefer not to say']
                    }
                  ].map((field) => (
                    <motion.div key={field.name} variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <span className="mr-2">{field.icon}</span>
                        {field.label}
                      </label>
                      {isEditing ? (
                        field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={editedData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type={field.type || 'text'}
                            name={field.name}
                            value={editedData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        )
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                          {field.name === 'dateOfBirth' 
                            ? new Date(userData[field.name]).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : userData[field.name].charAt(0).toUpperCase() + userData[field.name].slice(1)
                          }
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Addresses Section */}
            {activeSection === 'addresses' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">Saved Addresses</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Add New Address</span>
                  </motion.button>
                </div>

                {/* Add Address Form */}
                <AnimatePresence>
                  {showAddAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 p-6 rounded-xl space-y-4"
                    >
                      <h3 className="font-semibold text-gray-800">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Address Name (e.g., Home, Work)"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <select
                          value={newAddress.type}
                          onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAddAddress(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddAddress}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Save Address
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className={`border rounded-xl p-4 relative ${
                        address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                          {address.type === 'home' && '🏠'}
                          {address.type === 'work' && '💼'}
                          {address.type === 'other' && '📍'}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{address.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-600 text-sm">{address.country}</p>
                          
                          <div className="flex space-x-2 mt-3">
                            {!address.isDefault && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDefaultAddress(address.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Set as Default
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteAddress(address.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Payment Methods Section */}
            {activeSection === 'payment' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddPayment(!showAddPayment)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <span>💳</span>
                    <span>Add Payment Method</span>
                  </motion.button>
                </div>

                {/* Payment Methods List */}
                <div className="space-y-3">
                  {userData.paymentMethods.map((payment) => (
                    <motion.div
                      key={payment.id}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className={`border rounded-xl p-4 flex items-center justify-between ${
                        payment.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">
                          {payment.type === 'visa' && '💳'}
                          {payment.type === 'mastercard' && '💳'}
                          {payment.type === 'paypal' && '🅿️'}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} •••• {payment.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {payment.expDate} • {payment.cardholderName}
                          </p>
                          {payment.isDefault && (
                            <span className="text-xs text-blue-600 font-medium">Default Payment Method</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!payment.isDefault && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDefaultPayment(payment.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Set Default
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deletePaymentMethod(payment.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Notification Settings */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', icon: '📧' },
                      { key: 'pushNotifications', label: 'Push Notifications', icon: '🔔' },
                      { key: 'smsNotifications', label: 'SMS Notifications', icon: '📱' },
                      { key: 'marketingEmails', label: 'Marketing Emails', icon: '📨' }
                    ].map((setting) => (
                      <motion.div
                        key={setting.key}
                        variants={itemVariants}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span>{setting.icon}</span>
                          <span className="text-gray-700">{setting.label}</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePreferenceChange(
                            setting.key, 
                            !editedData.preferences[setting.key]
                          )}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editedData.preferences[setting.key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.span
                            layout
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editedData.preferences[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Language & Region */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Language & Region</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={editedData.preferences.language}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={editedData.preferences.currency}
                          onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                          <option>JPY (¥)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={editedData.preferences.timezone}
                          onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option>America/New_York (EST)</option>
                          <option>America/Chicago (CST)</option>
                          <option>America/Denver (MST)</option>
                          <option>America/Los_Angeles (PST)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password Change */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                    
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Update Password
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Two-Factor Authentication */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🔐</span>
                          <div>
                            <p className="font-medium text-gray-800">2FA Status</p>
                            <p className="text-sm text-green-600">Enabled</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm text-blue-600"
                        >
                          Manage
                        </motion.button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Recovery codes: 5 remaining</p>
                        <p>Last backup: March 1, 2024</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Login History */}
                  <motion.div variants={itemVariants} className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Login Activity</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <span>💻</span>
                            <div>
                              <p className="font-medium text-gray-800">Chrome on Windows</p>
                              <p className="text-gray-600">New York, NY • IP: 192.168.1.1</p>
                            </div>
                          </div>
                          <span className="text-gray-500">Just now</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <span>📱</span>
                            <div>
                              <p className="font-medium text-gray-800">Safari on iPhone</p>
                              <p className="text-gray-600">New York, NY • IP: 192.168.1.2</p>
                            </div>
                          </div>
                          <span className="text-gray-500">2 hours ago</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <span>💻</span>
                            <div>
                              <p className="font-medium text-gray-800">Firefox on Mac</p>
                              <p className="text-gray-600">New York, NY • IP: 192.168.1.3</p>
                            </div>
                          </div>
                          <span className="text-gray-500">Yesterday</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Account Actions */}
                  <motion.div variants={itemVariants} className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 text-red-600">Danger Zone</h3>
                    
                    <div className="border border-red-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Deactivate Account</p>
                          <p className="text-sm text-gray-600">Temporarily disable your account</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                        >
                          Deactivate
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="font-medium text-gray-800">Delete Account</p>
                          <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  ⚠️
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Account?</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      // Handle account deletion
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;