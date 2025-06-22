import React, { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Uploader from '../components/Uploader';
import TranscriptEditor from '../components/TranscriptEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultDisplay from '../components/ResultDisplay';
import EmailSender from '../components/EmailSender';
import { Toaster, toast } from 'react-hot-toast'; // For toast notifications

export default function Home() {
  const [inputType, setInputType] = useState('audio'); // 'audio' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleGenerateMinutes = async () => {
    setLoading(true);
    setMinutes(null); // Clear previous minutes
    toast.dismiss(); // Dismiss any existing toasts

    const formData = new FormData();
    let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/minutes/generate`;

    if (inputType === 'audio') {
      if (!selectedFile) {
        toast.error('Please upload an audio file.');
        setLoading(false);
        return;
      }
      formData.append('audio', selectedFile);
      // Backend will handle Whisper for audio, then Gemini
    } else { // inputType === 'text'
      if (!transcriptText.trim()) {
        toast.error('Please paste a transcript.');
        setLoading(false);
        return;
      }
      formData.append('transcript', transcriptText);
      // Backend will send text directly to Gemini
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMinutes(data.minutes);
      toast.success('Meeting minutes generated successfully!');
    } catch (error) {
      console.error('Error generating minutes:', error);
      toast.error(`Failed to generate minutes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (recipients, generatedMinutes) => {
    setIsSendingEmail(true);
    toast.dismiss();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/minutes/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients, minutes: generatedMinutes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>AI Meeting Minutes Generator</title>
        <meta name="description" content="Generate structured meeting minutes using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-right" reverseOrder={false} />

      <Hero />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <section className="mb-10">
          <AnimatePresence mode="wait">
            {inputType === 'audio' ? (
              <motion.div
                key="uploader"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Uploader
                  onFileAccepted={setSelectedFile}
                  onTypeChange={setInputType}
                  inputType={inputType}
                />
                {selectedFile && (
                  <p className="mt-4 text-center text-gray-600">
                    Selected File: <span className="font-medium text-primary-700">{selectedFile.name}</span>
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Uploader
                  onFileAccepted={setSelectedFile} // Still needed to update inputType
                  onTypeChange={setInputType}
                  inputType={inputType}
                />
                <div className="mt-6"> {/* Added margin top for spacing */}
                    <TranscriptEditor
                        transcript={transcriptText}
                        onTranscriptChange={setTranscriptText}
                    />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-10"
        >
          <button
            onClick={handleGenerateMinutes}
            disabled={loading || (inputType === 'audio' && !selectedFile) || (inputType === 'text' && !transcriptText.trim())}
            className="bg-primary-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {loading ? 'Generating...' : 'Generate Minutes'}
          </button>
        </motion.div>

        <section>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}

            {!loading && minutes && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ResultDisplay minutes={minutes} />
                <EmailSender
                  minutes={minutes}
                  onSendEmail={handleSendEmail}
                  isSending={isSendingEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
