// pages/Home.jsx
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  Shield, 
  HeadphonesIcon, 
  Fuel, 
  Coffee, 
  Beer,
  Truck,
  Star,
  ArrowRight,
  Smartphone,
  Zap,
  Award,
  Users
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Constants
const COLORS = {
  primary: {
    from: 'from-orange-500',
    to: 'to-orange-600',
    gradient: 'from-orange-500 via-orange-600 to-orange-700',
    light: 'orange-100',
    dark: 'orange-600'
  },
  secondary: {
    from: 'from-blue-500',
    to: 'to-blue-600'
  },
  success: {
    from: 'from-green-500',
    to: 'to-teal-500'
  },
  warning: {
    from: 'from-yellow-500',
    to: 'to-orange-500'
  }
};

// Animation variants
const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  }
};

// Data constants
const HERO_STATS = [
  { value: '10K+', label: 'Happy Customers', icon: Users },
  { value: '50K+', label: 'Deliveries', icon: Truck },
  { value: '100+', label: 'Products', icon: Coffee },
  { value: '24/7', label: 'Support', icon: Clock }
];

const CATEGORIES = [
  { 
    icon: Fuel, 
    title: 'Gas Delivery', 
    description: 'Premium fuel at your doorstep',
    features: ['Quality Guaranteed', 'Fast Service', 'Best Prices'],
    color: COLORS.secondary,
    emoji: '⛽'
  },
  { 
    icon: Coffee, 
    title: 'Food & Snacks', 
    description: 'Fresh meals & quick bites',
    features: ['Hot & Fresh', 'Variety Options', 'Dietary Choices'],
    color: { from: 'from-orange-500', to: 'to-red-500' },
    emoji: '🍔'
  },
  { 
    icon: Beer, 
    title: 'Beverages', 
    description: 'Refreshing drinks collection',
    features: ['Cold Drinks', 'Energy Drinks', 'Fresh Juices'],
    color: COLORS.success,
    emoji: '🥤'
  }
];

const DEALS = [
  { emoji: '🍔', title: 'Combo Meal', discount: 'Save 25%', color: 'from-orange-500 to-red-500', price: '$12.99' },
  { emoji: '🥤', title: 'Cold Drinks', discount: 'Buy 2 Get 1', color: 'from-blue-500 to-cyan-500', price: 'From $2.99' },
  { emoji: '⛽', title: 'Fuel', discount: 'Save $0.50/gal', color: 'from-purple-500 to-pink-500', price: 'Best Rate' },
  { emoji: '🍕', title: 'Pizza Deal', discount: 'Free Delivery', color: 'from-yellow-500 to-orange-500', price: '$15.99' },
  { emoji: '🥗', title: 'Healthy Bowls', discount: '20% OFF', color: 'from-green-500 to-emerald-500', price: '$9.99' },
  { emoji: '🧋', title: 'Specialty Drinks', discount: 'Happy Hour', color: 'from-indigo-500 to-purple-500', price: 'From $3.99' }
];

const FEATURES = [
  { 
    icon: Zap, 
    title: 'Lightning Fast', 
    description: 'Delivery under 30 minutes',
    color: COLORS.primary,
    stat: '< 30 min'
  },
  { 
    icon: Shield, 
    title: 'Secure Payment', 
    description: '100% secure transactions',
    color: COLORS.success,
    stat: 'SSL Secure'
  },
  { 
    icon: Award, 
    title: 'Quality Assured', 
    description: 'Premium products only',
    color: { from: 'from-purple-500', to: 'to-pink-500' },
    stat: '100% Fresh'
  },
  { 
    icon: HeadphonesIcon, 
    title: '24/7 Support', 
    description: 'Always here to help',
    color: { from: 'from-blue-500', to: 'to-indigo-500' },
    stat: 'Live Chat'
  }
];

// Reusable Components
const SectionTitle = memo(({ title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  </div>
));

SectionTitle.displayName = 'SectionTitle';

const StatCard = memo(({ value, label, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
    className="text-center"
  >
    <div className="inline-block p-3 bg-white/20 rounded-2xl mb-3">
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-orange-200 text-sm">{label}</div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const CategoryCard = memo(({ category, index }) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInUp}
    whileHover={{ y: -10 }}
    className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${category.color.from} ${category.color.to} opacity-0 group-hover:opacity-10 transition-opacity`} />
    <div className="p-8">
      <div className={`inline-block p-4 bg-gradient-to-br ${category.color.from} ${category.color.to} rounded-2xl text-white mb-4 shadow-lg`}>
        <category.icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
      <p className="text-gray-600 mb-4">{category.description}</p>
      <ul className="space-y-2">
        {category.features.map((feature, i) => (
          <li key={i} className="text-sm text-gray-500 flex items-center">
            <Star className="h-4 w-4 text-orange-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <motion.button
        whileHover={{ x: 5 }}
        className="mt-6 text-orange-600 font-semibold flex items-center group"
      >
        Learn More 
        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  </motion.div>
));

CategoryCard.displayName = 'CategoryCard';

const DealCard = memo(({ deal, index }) => (
  <motion.div
    variants={ANIMATION_VARIANTS.fadeInUp}
    whileHover={{ scale: 1.05, y: -5 }}
    className={`bg-gradient-to-br ${deal.color} p-6 rounded-2xl shadow-lg text-white text-center cursor-pointer group`}
  >
    <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform">
      {deal.emoji}
    </span>
    <h4 className="font-bold text-lg mb-1">{deal.title}</h4>
    <p className="text-sm opacity-90 mb-2">{deal.discount}</p>
    <p className="text-xs font-semibold bg-white/20 rounded-full px-3 py-1 inline-block">
      {deal.price}
    </p>
  </motion.div>
));

DealCard.displayName = 'DealCard';

const FeatureCard = memo(({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeInUp}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -m-0.5 blur" />
      <div className="relative bg-white p-8 rounded-2xl shadow-lg">
        <div className={`inline-block p-4 bg-gradient-to-br ${feature.color.from} ${feature.color.to} rounded-2xl text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="absolute top-4 right-4 text-2xl font-bold text-gray-100">
          {feature.stat}
        </div>
        <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Main Component
const Home = () => {
  const backgroundPattern = useMemo(() => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}
    />
  ), []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        {backgroundPattern}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          {/* Floating Elements */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative pt-20 container mx-auto px-4 text-center text-white z-10">
          <motion.div
            variants={ANIMATION_VARIANTS.slideInFromLeft}
            initial="initial"
            animate="animate"
          >
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              🚀 Fast Delivery • 24/7 Service
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Food & Drinks, Gas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                Delivered in Minutes!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Your one-stop shop for premium fuel, delicious food, and refreshing beverages
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-300/50 transition-all flex items-center justify-center space-x-4"
              >
                <NavLink to="/products"><span>Order Now</span></NavLink>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all backdrop-blur-sm"
              >
                <NavLink to="/products">View Menu</NavLink>
                
              </motion.button>
            </div>

            {/* Stats Grid */}
            <motion.div
              variants={ANIMATION_VARIANTS.staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {HERO_STATS.map((stat, index) => (
                <StatCard key={index} {...stat} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
          <span className="sr-only">Scroll down</span>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="What Would You Like?" 
            subtitle="Choose from our premium selection of products delivered straight to your doorstep"
          />

          <motion.div
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {CATEGORIES.map((category, index) => (
              <CategoryCard key={index} category={category} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Hot Deals 🔥" 
            subtitle="Exclusive offers you don't want to miss"
          />

          <motion.div
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {DEALS.map((deal, index) => (
              <DealCard key={index} deal={deal} index={index} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors inline-flex items-center">
              View All Deals <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Why Choose Us?" 
            subtitle="Experience the difference with our premium service"
          />

          <motion.div
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="What Our Customers Say" 
            subtitle="Join thousands of satisfied customers"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
              <div className="absolute -top-4 left-8 text-6xl text-orange-500 opacity-20">"</div>
              <div className="relative">
                <p className="text-xl md:text-2xl text-gray-700 mb-6">
                  "The fastest delivery service I've ever used! Got my fuel and snacks within 15 minutes. 
                  The app is super easy to use and the customer support is amazing."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    BB
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Byiringiro Bonheur</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInScale}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur-sm">
              🎉 Special Offer
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Download our app now and get <span className="font-bold">$10 off</span> your first order!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all flex items-center justify-center space-x-2 shadow-2xl"
              >
                <Smartphone className="h-5 w-5" />
                <span>App Store</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all flex items-center justify-center space-x-2 shadow-2xl"
              >
                <Smartphone className="h-5 w-5" />
                <span>Google Play</span>
              </motion.button>
            </div>

            <p className="text-orange-100 mt-6 text-sm">
              *No credit card required • Free delivery on first order
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default memo(Home);