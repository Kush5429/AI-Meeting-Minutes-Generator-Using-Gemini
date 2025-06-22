import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-20 px-6 sm:px-8 lg:px-10 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-2xl rounded-b-3xl"
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
        <motion.span
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI Meeting Minutes
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="block text-primary-100 drop-shadow-lg"
        >
          Generator 🚀
        </motion.span>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 text-primary-50/90"
      >
        Effortlessly transform your meeting audio or text transcripts into structured, actionable notes.
      </motion.p>
    </motion.section>
  );
};

export default Hero;
