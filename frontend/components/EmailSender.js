import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailSender = ({ minutes, onSendEmail, isSending }) => {
  const [recipients, setRecipients] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipients.trim()) {
      toast.error('Please enter recipient email addresses.');
      return;
    }
    await onSendEmail(recipients, minutes);
    setRecipients(''); // Clear input after sending
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Mail className="w-6 h-6 mr-2 text-primary-600" /> Email Minutes to Participants
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Emails (comma-separated):
          </label>
          <input
            type="text"
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-base"
            placeholder="e.g., alice@example.com, bob@example.com"
            disabled={isSending}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-md shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-semibold text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSending || !minutes}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </motion.button>
      </form>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Note: This is a simulated email sending. For production, integrate with an email service like SendGrid or Nodemailer.
      </p>
    </motion.div>
  );
};

export default EmailSender;
