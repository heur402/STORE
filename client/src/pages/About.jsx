// pages/About.jsx
import React from 'react';
import { Truck, Users, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 ">
      <h1 className="text-4xl font-bold mb-8 text-center">About STORE</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-8 text-center">
          We're revolutionizing the way you get fuel, food, and drinks. 
          Our mission is to bring convenience to your doorstep with lightning-fast delivery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Truck className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Our Story</h3>
            <p className="text-gray-600">
              Founded in 2024, STORE started with a simple idea: 
              why should you have to leave your home for fuel and snacks? 
              Now we serve thousands of happy customers daily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Users className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Our Team</h3>
            <p className="text-gray-600">
              We're a dedicated team of delivery experts, customer service 
              professionals, and tech innovators working together to serve you better.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Award className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Our Quality</h3>
            <p className="text-gray-600">
              We partner with trusted brands and local vendors to ensure 
              every product meets our high standards of quality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Heart className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Our Promise</h3>
            <p className="text-gray-600">
              Fast delivery, best prices, and 24/7 support - we're committed 
              to making your experience exceptional every time.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">50K+</div>
            <div className="text-gray-600">Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">100+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;