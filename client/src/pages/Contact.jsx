import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocateFixed, Mail, Phone } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });

    const [activeField, setActiveField] = useState(null);

    const contactInfo = [
        {
            icon: <LocateFixed className="h-9 w-9 text-red-700" />,
            title: 'Visit Us',
            details: ['KG 778 st', 'Kigali,  KG 778 st', 'Rwanda'],
            action: 'Get Directions',
            link: '#'
        },
        {
            icon: <Phone className="h-9 w-9 text-red-700" />,
            title: 'Call Us',
            details: ['+250 796 577 776', '+250 783 450 857'],
            action: 'Call Now',
            link: 'tel:+250796577776'
        },
        {
            icon: <Mail className="h-9 w-9 text-red-700" />,
            title: 'Email Us',
            details: ['byirngirobon01fra@gmail.com', 'byirngiro@gmail.com'],
            action: 'Send Email',
            link: 'mailto:byirngirobon01fra@gmail.com'
        },
    ];

    const faqs = [
        {
            question: 'What are your business hours?',
            answer: 'We are open Monday through Friday from 9:00 AM to 6:00 PM EST, and Saturdays from 10:00 AM to 4:00 PM EST. We are closed on Sundays and major holidays.'
        },
        {
            question: 'How quickly do you respond to inquiries?',
            answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, we recommend calling our support line.'
        },
        {
            question: 'Do you offer international support?',
            answer: 'Yes, we support customers worldwide. Please check your local calling rates when using our phone support.'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simulate form submission
        setFormStatus({
            submitted: true,
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.'
        });

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormStatus({
                submitted: false,
                success: false,
                message: ''
            });
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        },
        tap: { scale: 0.95 }
    };

    const inputVariants = {
        focused: {
            scale: 1.02,
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
        },
        blurred: {
            scale: 1,
            borderColor: "#d1d5db"
        }
    };

  return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 "
                />

                <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold text-white mb-6"
                            animate={{
                                textShadow: ["0 0 10px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.5)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            className="text-xl text-blue-100 max-w-2xl mx-auto"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Wave Divider */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                >
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="white"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer"
                        >
                            <motion.div
                                className="text-4xl mb-4"
                                animate={{
                                    rotate: [1, 8, -8, 1],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 9, delay: index * 0.2, repeat: Infinity }}
                            >
                                {info.icon}
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{info.title}</h3>
                            {info.details.map((detail, i) => (
                                <p key={i} className="text-gray-600 text-sm mb-1">{detail}</p>
                            ))}
                            <motion.a
                                href={info.link}
                                className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-800"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {info.action} →
                            </motion.a>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Contact Form and Map Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <motion.h2
                            className="text-3xl font-bold text-gray-800 mb-6"
                            whileInView={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            Send Us a Message
                        </motion.h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {['name', 'email', 'subject'].map((field) => (
                                <motion.div
                                    key={field}
                                    variants={inputVariants}
                                    animate={activeField === field ? "focused" : "blurred"}
                                    className="relative"
                                >
                                    <motion.label
                                        htmlFor={field}
                                        className="block text-sm font-medium text-gray-700 mb-2 capitalize"
                                        animate={activeField === field ? { x: 5, color: "#3b82f6" } : {}}
                                    >
                                        {field}
                                    </motion.label>
                                    <motion.input
                                        type={field === 'email' ? 'email' : 'text'}
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        onFocus={() => setActiveField(field)}
                                        onBlur={() => setActiveField(null)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <AnimatePresence>
                                        {activeField === field && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute right-3 top-10 text-blue-500"
                                            >
                                                ✏️
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}

                            <motion.div
                                variants={inputVariants}
                                animate={activeField === 'message' ? "focused" : "blurred"}
                            >
                                <motion.label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    animate={activeField === 'message' ? { x: 5, color: "#3b82f6" } : {}}
                                >
                                    Message
                                </motion.label>
                                <motion.textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    onFocus={() => setActiveField('message')}
                                    onBlur={() => setActiveField(null)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg shadow-lg"
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.5)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                disabled={formStatus.submitted}
                            >
                                {formStatus.submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            ⚡
                                        </motion.span>
                                        <span>Sending...</span>
                                    </motion.div>
                                ) : (
                                    'Send Message'
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {formStatus.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`p-4 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {formStatus.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>

                    {/* Map and Additional Info */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Map Placeholder */}
                        <motion.div
                            className="bg-gray-200 rounded-2xl overflow-hidden h-64 relative"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                                animate={{
                                    background: [
                                        "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)",
                                        "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)"
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-6xl mb-2"
                                    >
                                        🗺️
                                    </motion.div>
                                    <p className="text-gray-700 font-medium">Interactive Map</p>
                                    <p className="text-sm text-gray-500">KG 778 st, NY</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Business Hours */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-6"
                            whileHover={{ boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)" }}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h3>
                            <div className="space-y-3">
                                {[
                                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                                    { day: 'Sunday', hours: 'Closed' }
                                ].map((schedule, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                                        whileHover={{ x: 5 }}
                                    >
                                        <span className="text-gray-600">{schedule.day}</span>
                                        <motion.span
                                            className={`font-medium ${schedule.hours === 'Closed' ? 'text-red-500' : 'text-green-600'
                                                }`}
                                            animate={schedule.hours === 'Closed' ? { opacity: [1, 0.5, 1] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {schedule.hours}
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick FAQs</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <motion.button
                                            className="w-full text-left"
                                            whileHover={{ x: 5 }}
                                        >
                                            <p className="font-medium text-gray-800 flex items-center space-x-2">
                                                <motion.span
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, delay: index * 0.3 }}
                                                >
                                                    ❓
                                                </motion.span>
                                                <span>{faq.question}</span>
                                            </p>
                                            <motion.p
                                                className="text-sm text-gray-600 mt-1 ml-6"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                            >
                                                {faq.answer}
                                            </motion.p>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default Contact;