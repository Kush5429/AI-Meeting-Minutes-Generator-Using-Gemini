import React from 'react';
import { motion } from 'framer-motion';

const spinVariants = {
  spin: {
    rotate: 360,
    transition: {
      loop: Infinity,
      ease: "linear",
      duration: 1,
    },
  },
};

const LoadingSpinner = ({ message = "Processing your request..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <motion.div
        className="w-12 h-12 border-4 border-t-4 border-primary-500 border-t-transparent rounded-full"
        variants={spinVariants}
        animate="spin"
      />
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500 mt-2">This may take a moment, especially for audio files.</p>
    </motion.div>
  );
};

export default LoadingSpinner;
