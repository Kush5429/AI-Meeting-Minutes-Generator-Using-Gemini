import React from 'react';
import { motion } from 'framer-motion';

const TranscriptEditor = ({ transcript, onTranscriptChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <label htmlFor="transcript" className="block text-lg font-medium text-gray-700 mb-3">
        Paste your meeting transcript here:
      </label>
      <textarea
        id="transcript"
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        rows="10"
        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-base resize-y font-mono"
        placeholder="e.g., 'Attendees: John, Jane, Mike. Discussion: Q1 review, new project ideas...'"
      ></textarea>
    </motion.div>
  );
};

export default TranscriptEditor;
