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
        <h3 className="text-xl font-semibold mb-2">Advantages</h3>
        <ul className="list-disc pl-5 text-gray-700 mb-4">
          {algorithm.id === 'fcfs' && (
            <>
              <li>Simple and straightforward implementation</li>
              <li>Fair in terms of order of arrival - no request starvation</li>
              <li>Low CPU overhead</li>
              <li>Good for systems with low disk I/O load</li>
            </>
          )}
          {algorithm.id === 'sstf' && (
            <>
              <li>Significantly reduces average seek time compared to FCFS</li>
              <li>Provides high throughput</li>
              <li>Good for systems with high disk I/O load</li>
              <li>Optimal for systems with similar request patterns</li>
            </>
          )}
          {algorithm.id === 'scan' && (
            <>
              <li>Better performance than FCFS and SSTF in most cases</li>
              <li>Prevents indefinite postponement of any request</li>
              <li>Low variance in response time</li>
              <li>Efficient for systems with high disk loads</li>
            </>
          )}
          {algorithm.id === 'cscan' && (
            <>
              <li>More uniform wait times compared to SCAN</li>
              <li>Better response time distribution than SCAN</li>
              <li>Treats all requests more fairly</li>
              <li>Ideal for systems with heavy disk loads</li>
            </>
          )}
          {algorithm.id === 'look' && (
            <>
              <li>More efficient than SCAN by avoiding unnecessary movements</li>
              <li>Reduces average seek time compared to SCAN</li>
              <li>Better overall disk utilization</li>
              <li>Maintains fairness while improving performance</li>
            </>
          )}
          {algorithm.id === 'clook' && (
            <>
              <li>Most efficient variant of SCAN family</li>
              <li>Combines benefits of C-SCAN and LOOK</li>
              <li>Excellent average response time</li>
              <li>Best uniform wait time distribution</li>
            </>
          )}
        </ul>

        <h3 className="text-xl font-semibold mb-2">Disadvantages</h3>
        <ul className="list-disc pl-5 text-gray-700 mb-4">
          {algorithm.id === 'fcfs' && (
            <>
              <li>High average seek time</li>
              <li>Poor performance with scattered requests</li>
              <li>No optimization for seek time reduction</li>
              <li>Not suitable for high-load systems</li>
            </>
          )}
          {algorithm.id === 'sstf' && (
            <>
              <li>Can cause starvation of some requests</li>
              <li>Overhead in calculating shortest seek time</li>
              <li>Unpredictable waiting times</li>
              <li>Not optimal for varying workloads</li>
            </>
          )}
          {algorithm.id === 'scan' && (
            <>
              <li>Long waiting time for requests just visited</li>
              <li>May not be optimal for light loads</li>
              <li>Extra head movement to disk ends</li>
              <li>Can cause uneven response times</li>
            </>
          )}
          {algorithm.id === 'cscan' && (
            <>
              <li>Longer seek times than LOOK and C-LOOK</li>
              <li>Extra overhead in moving to disk start</li>
              <li>May be inefficient for light loads</li>
              <li>Higher average seek time than SCAN</li>
            </>
          )}
          {algorithm.id === 'look' && (
            <>
              <li>More complex implementation than SCAN</li>
              <li>May not provide as uniform service as C-LOOK</li>
              <li>Can still lead to some request starvation</li>
              <li>Requires tracking of request ranges</li>
            </>
          )}
          {algorithm.id === 'clook' && (
            <>
              <li>Most complex implementation in SCAN family</li>
              <li>Higher overhead in tracking request ranges</li>
              <li>May not be optimal for very light loads</li>
              <li>Requires more sophisticated queue management</li>
            </>
          )}
        </ul>

        <h3 className="text-xl font-semibold mb-2">Comparison with Other Algorithms</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {algorithm.id === 'fcfs' && (
            <>
              <li>Simplest but least efficient compared to other algorithms</li>
              <li>Most fair in terms of order but worst in performance</li>
              <li>SSTF, SCAN, and their variants all perform better</li>
              <li>Only preferred in very light load situations</li>
            </>
          )}
          {algorithm.id === 'sstf' && (
            <>
              <li>Better performance than FCFS but less fair</li>
              <li>More efficient than FCFS but can cause starvation</li>
              <li>SCAN family provides better fairness</li>
              <li>Good middle ground between FCFS and SCAN</li>
            </>
          )}
          {algorithm.id === 'scan' && (
            <>
              <li>More efficient than FCFS and SSTF</li>
              <li>More fair than SSTF but less efficient than C-SCAN for uniform access</li>
              <li>LOOK improves upon it by reducing unnecessary movements</li>
              <li>Better overall balance of efficiency and fairness</li>
            </>
          )}
          {algorithm.id === 'cscan' && (
            <>
              <li>More uniform service than SCAN</li>
              <li>Better response time distribution than SCAN</li>
              <li>C-LOOK improves upon it by reducing unnecessary movements</li>
              <li>Best choice for heavy loads with uniform distribution</li>
            </>
          )}
          {algorithm.id === 'look' && (
            <>
              <li>More efficient than SCAN with similar fairness</li>
              <li>Better average performance than SCAN and SSTF</li>
              <li>C-LOOK provides more uniform wait times</li>
              <li>Good balance of efficiency and implementation complexity</li>
            </>
          )}
          {algorithm.id === 'clook' && (
            <>
              <li>Most efficient among all disk scheduling algorithms</li>
              <li>Better performance than C-SCAN with similar fairness</li>
              <li>Combines best features of LOOK and C-SCAN</li>
              <li>Optimal choice for most modern systems</li>
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