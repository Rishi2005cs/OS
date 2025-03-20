import React from 'react';
import { motion } from 'framer-motion';

const DiskSchedulingHome = ({ algorithms, onAlgorithmSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">What is Disk Scheduling?</h2>
        <p className="text-gray-700 mb-4">
          Disk scheduling is the method used by operating systems to decide which pending I/O requests should be serviced next. 
          Effective disk scheduling algorithms can significantly improve system performance by minimizing seek time, 
          maximizing throughput, and ensuring fairness in request handling.
        </p>
        <p className="text-gray-700 mb-4">
          The disk head movement is the most time-consuming operation in disk access. 
          Therefore, disk scheduling algorithms aim to minimize the total head movement required to satisfy all pending requests.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Disk Scheduling Algorithms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algorithm) => (
          <motion.div
            key={algorithm.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAlgorithmSelect(algorithm.id)}
          >
            <div className="p-6 cursor-pointer">
              <h3 className="text-xl font-bold mb-2 text-blue-600">{algorithm.name}</h3>
              <p className="text-gray-600 mb-4">{algorithm.description}</p>
              <div className="flex justify-end">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAlgorithmSelect(algorithm.id);
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DiskSchedulingHome;