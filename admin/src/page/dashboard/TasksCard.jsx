// src/page/dashboard/TasksCard.jsx
import React from "react";
import { motion } from "framer-motion";

const TasksCard = ({ tasks, styles }) => {
  return (
    <div className={styles.card}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold text-lg ${styles.text.primary}`}>
          Tasks & Alerts
        </h3>
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {tasks.length} pending
        </span>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${styles.text.primary}`}>
                {task.title}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400`}>
              {task.count}
            </span>
          </motion.li>
        ))}
      </ul>

      <button className={`mt-4 w-full text-sm py-2 rounded-lg border ${styles.border} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${styles.text.secondary}`}>
        View All Tasks
      </button>
    </div>
  );
};

export default TasksCard;