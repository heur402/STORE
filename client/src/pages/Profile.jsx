import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GithubIcon, InstagramIcon, TwitterIcon, Package, Star, ShoppingCart, UserIcon, Diamond, Link2, Phone, Mail, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  
  // User data state initialized from AuthContext
  const [userData, setUserData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    displayName: user?.displayName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || 'No bio yet...',
    avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'default'),
    preferences: user?.preferences || {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: true,
    },
    memberSince: user?.createdAt || new Date().toISOString(),
    addresses: user?.deliveryAddress ? [{ ...user.deliveryAddress, id: 'default', name: 'Default', isDefault: true, type: 'home' }] : [
      { id: '1', name: 'Home', street: '123 Delivery Lane', city: 'Kigali', state: 'Kigali', zipCode: '0000', country: 'Rwanda', isDefault: true, type: 'home' }
    ],
    paymentMethods: [
      { id: '1', type: 'visa', last4: '4242', expDate: '12/26', cardholderName: user?.name || 'User Name', isDefault: true }
    ],
    socialLinks: {
      twitter: '@' + (user?.username || 'user'),
      instagram: '@' + (user?.username || 'user')
    }
  });

  const [editedData, setEditedData] = useState({ ...userData });

  useEffect(() => {
    if (user) {
      const initData = {
        name: user.name || '',
        username: user.username || '',
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || 'No bio yet...',
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.name || 'default'),
        preferences: user.preferences || {
          emailNotifications: true,
          pushNotifications: false,
          smsNotifications: true,
        },
        memberSince: user.createdAt || new Date().toISOString(),
        addresses: user.deliveryAddress ? [{ ...user.deliveryAddress, id: 'default', name: 'Default', isDefault: true, type: 'home' }] : [
          { id: '1', name: 'Home', street: '123 Delivery Lane', city: 'Kigali', state: 'Kigali', zipCode: '0000', country: 'Rwanda', isDefault: true, type: 'home' }
        ],
        paymentMethods: [
          { id: '1', type: 'visa', last4: '4242', expDate: '12/26', cardholderName: user.name || 'User Name', isDefault: true }
        ],
        socialLinks: {
          twitter: '@' + (user.username || 'user'),
          instagram: '@' + (user.username || 'user')
        }
      };
      setUserData(initData);
      setEditedData(initData);
    }
  }, [user]);

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await productAPI.getAll();
        setRecommendedProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };
    fetchRecommended();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: editedData.name,
        username: editedData.username,
        displayName: editedData.displayName,
        bio: editedData.bio,
        phone: editedData.phone
      };

      await updateProfile(updateData);
      setUserData(editedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({...userData});
    setIsEditing(false);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'security', label: 'Security', icon: <Lock /> }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      {/* Cover Photo & Avatar Section */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative h-64 md:h-80 bg-gradient-to-r from-orange-500 to-orange-600"
      >
        <motion.div 
          className="absolute -bottom-16 left-8 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black text-5xl font-bold uppercase"
            >
              {userData.name.charAt(0)}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Profile Header Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <p className="text-gray-600 flex items-center"><span className="mr-2"><Link2 /></span> @{userData.username}</p>
                <p className="text-gray-600 flex items-center"><span className="mr-2"><Mail /></span> {userData.email}</p>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2"><Calendar /></span> Member since {new Date(userData.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                className={`px-6 py-2 rounded-lg flex items-center space-x-2 font-semibold shadow-lg transition-all ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={loading}
              >
                <span>{loading ? 'Updating...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </motion.button>
              
              {isEditing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
          <motion.p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg">{userData.bio}</motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm mb-6 overflow-x-auto"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg whitespace-nowrap transition-all ${activeSection === section.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm p-8 min-h-[400px]"
          >
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', name: 'name', icon: <UserIcon /> },
                    { label: 'Username', name: 'username', icon: <Link2 /> },
                    { label: 'Email', name: 'email', icon: <Mail />, disabled: true },
                    { label: 'Phone', name: 'phone', icon: <Phone /> }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <span className="mr-2">{field.icon}</span> {field.label}
                      </label>
                      {isEditing && !field.disabled ? (
                        <input
                          name={field.name}
                          value={editedData[field.name]}
                          onChange={handleInputChange}
                          placeholder={`Enter your ${field.label.toLowerCase()}...`}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      ) : (
                          <div
                            className={`p-3 rounded-xl border transition-all ${!userData[field.name]
                              ? 'bg-orange-50/50 border-orange-100 text-orange-400 italic cursor-pointer hover:bg-orange-50'
                              : 'bg-gray-50 border-transparent text-gray-800'
                              }`}
                            onClick={() => !isEditing && !field.disabled && setIsEditing(true)}
                          >
                            {userData[field.name] || `No ${field.label.toLowerCase()} added yet`}
                            {!userData[field.name] && !field.disabled && (
                              <span className="ml-2 text-[10px] font-bold uppercase text-orange-600"> + Add</span>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">📝 Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editedData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us something about yourself..."
                      rows="4"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  ) : (
                      <div
                        className={`p-4 rounded-xl border border-dashed transition-all ${!userData.bio || userData.bio === 'No bio yet...'
                          ? 'bg-orange-50/50 border-orange-200 text-orange-600 cursor-pointer hover:bg-orange-50'
                          : 'bg-gray-50 border-transparent text-gray-800'
                          }`}
                        onClick={() => !isEditing && setIsEditing(true)}
                      >
                        {userData.bio || 'Add a bio to let others know you better!'}
                        {(!userData.bio || userData.bio === 'No bio yet...') && (
                          <span className="ml-2 text-xs font-bold uppercase tracking-wider"> + Add Bio</span>
                        )}
                      </div>
                  )}
                </div>
              </div>
            )}


            {activeSection === 'security' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-700">Change Password</h3>
                    <input type="password" placeholder="Current Password" className="w-full p-3 border rounded-xl" />
                    <input type="password" placeholder="New Password" className="w-full p-3 border rounded-xl" />
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Update Password</button>
                  </div>
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-4">
                    <h3 className="font-bold text-red-700">Danger Zone</h3>
                    <p className="text-sm text-red-600 opacity-80">Deleting your account is permanent and cannot be undone.</p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Recommended Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <Link to="/products" className="text-blue-600 font-bold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
            {recommendedProducts.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No products to show right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            >
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2">Delete Account?</h3>
              <p className="text-gray-600 mb-8">Are you sure? This action is irreversible and all your data will be lost forever.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
