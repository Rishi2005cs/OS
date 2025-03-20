import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmDetail = ({ algorithm, onBackClick, onSimulateClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <button 
        onClick={onBackClick}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Algorithms
      </button>

      <h2 className="text-3xl font-bold text-blue-700 mb-4">{algorithm.name}</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <p className="text-gray-700">{algorithm.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">How It Works</h3>
        <p className="text-gray-700">{algorithm.details}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Characteristics</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {algorithm.id === 'fcfs' && (
            <>
              <li>Simple implementation</li>
              <li>Fair in terms of order of arrival</li>
              <li>High average seek time</li>
              <li>No starvation</li>
            </>
          )}
          {algorithm.id === 'sstf' && (
            <>
              <li>Reduces average seek time compared to FCFS</li>
              <li>May cause starvation for requests far from current position</li>
              <li>Not optimal for high load systems</li>
              <li>Favors middle cylinders</li>
            </>
          )}
          {algorithm.id === 'scan' && (
            <>
              <li>Also known as the elevator algorithm</li>
              <li>Better performance than FCFS and SSTF</li>
              <li>Prevents starvation</li>
              <li>Favors requests close to the edges</li>
            </>
          )}
          {algorithm.id === 'cscan' && (
            <>
              <li>Provides more uniform wait times than SCAN</li>
              <li>Treats the disk as a circular list</li>
              <li>Reduces maximum response time</li>
              <li>More fair than SCAN</li>
            </>
          )}
          {algorithm.id === 'look' && (
            <>
              <li>Improved version of SCAN</li>
              <li>Avoids unnecessary movement to the end of the disk</li>
              <li>Better average seek time than SCAN</li>
              <li>Still maintains fairness</li>
            </>
          )}
          {algorithm.id === 'clook' && (
            <>
              <li>Improved version of C-SCAN</li>
              <li>Avoids unnecessary movement to the end of the disk</li>
              <li>Better average seek time than C-SCAN</li>
              <li>Maintains uniform wait times</li>
            </>
          )}
        </ul>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSimulateClick}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors duration-300 shadow-md"
        >
          Simulate {algorithm.name}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AlgorithmDetail;