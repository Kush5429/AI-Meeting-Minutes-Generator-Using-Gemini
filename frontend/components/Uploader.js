import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileText } from 'lucide-react'; // Using lucide-react for icons

const Uploader = ({ onFileAccepted, onTypeChange, inputType }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
    },
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-center mb-6">
        <button
          onClick={() => onTypeChange('audio')}
          className={`px-6 py-3 rounded-full font-medium text-lg flex items-center transition-all duration-300 ${
            inputType === 'audio'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <UploadCloud className="w-5 h-5 mr-2" /> Upload Audio
        </button>
        <button
          onClick={() => onTypeChange('text')}
          className={`ml-4 px-6 py-3 rounded-full font-medium text-lg flex items-center transition-all duration-300 ${
            inputType === 'text'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-5 h-5 mr-2" /> Paste Text
        </button>
      </div>

      {inputType === 'audio' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
          `}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-primary-400 mb-3" />
          {isDragActive ? (
            <p className="text-primary-700 font-medium">Drop the audio file here ...</p>
          ) : (
            <p className="text-gray-600">Drag 'n' drop an audio file here, or click to select one</p>
          )}
          <p className="text-sm text-gray-500 mt-2">(.mp3, .wav, .ogg, .m4a)</p>
        </div>
      )}
    </motion.div>
  );
};

export default Uploader;
