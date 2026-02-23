// src/page/dashboard/ActivityFeed.jsx
import React from "react";
import { motion } from "framer-motion";

const ActivityFeed = ({ activities, styles }) => {
  return (
    <div className={styles.card}>
      <h3 className={`font-semibold text-lg mb-4 ${styles.text.primary}`}>
        Activity Feed
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            whileHover={{ x: 4 }}
            className="flex items-start gap-3"
          >
            <div className={`w-2 h-2 mt-2 rounded-full ${
              index % 3 === 0 ? 'bg-green-500' :
              index % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500'
            }`} />

            <div className="flex-1">
              <p className={`text-sm ${styles.text.primary}`}>
                {activity.text}
              </p>
              <p className={`text-xs mt-1 ${styles.text.muted}`}>
                {index % 2 === 0 ? '2 minutes ago' : '1 hour ago'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className={`text-xs ${styles.text.muted}`}>Live updates</span>
      </div>
    </div>
  );
};

export default ActivityFeed;