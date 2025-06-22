import React from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardCheck, MessageSquare, ListTodo } from 'lucide-react';

const ResultDisplay = ({ minutes }) => {
  if (!minutes || Object.keys(minutes).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center text-gray-500"
      >
        No minutes generated yet. Upload an audio file or paste a transcript to begin!
      </motion.div>
    );
  }

  const sections = [
    { title: 'Attendees', key: 'attendees', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Decisions Made', key: 'decisionsMade', icon: ClipboardCheck, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: 'Key Discussion Points', key: 'keyDiscussionPoints', icon: MessageSquare, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { title: 'Action Items', key: 'actionItems', icon: ListTodo, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  const renderItem = (sectionKey, item) => {
    if (sectionKey === 'actionItems') {
      let parsed = item;
      if (typeof item === 'string') {
        try {
          parsed = JSON.parse(item);
        } catch {
          return item; // fallback
        }
      }
      if (parsed && typeof parsed === 'object' && parsed.assignee && parsed.item) {
        return (
          <span>
            <strong>{parsed.assignee}:</strong> {parsed.item}
          </span>
        );
      }
      return JSON.stringify(parsed);
    } else {
      return item;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meeting Minutes Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            whileHover={{
              y: -6,
              scale: 1.03,
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            className={`p-5 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer ${section.bgColor}`}
          >
            <div className="flex items-center mb-3">
              <section.icon className={`w-7 h-7 mr-3 ${section.color}`} />
              <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
            </div>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {minutes[section.key] && minutes[section.key].length > 0 ? (
                minutes[section.key].map((item, idx) => (
                  <li key={idx} className="text-base leading-relaxed">
                    {renderItem(section.key, item)}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No {section.title.toLowerCase()} identified.</li>
              )}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
