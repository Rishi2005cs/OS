import React from 'react';
import './Disk_Scheduling_Home.css';

const Disk_Scheduling_Home = ({ algorithms, onAlgorithmSelect }) => {
  return (
    <div>
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
          <div
            key={algorithm.id}
            className="algorithm-card"
            onClick={() => onAlgorithmSelect(algorithm.id)}
          >
            <h3>{algorithm.name}</h3>
            <p>{algorithm.description}</p>
            <button 
              className="learn-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAlgorithmSelect(algorithm.id);
              }}
            >
              Learn More
            </button>
            <div className="go-corner">
              <div className="go-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disk_Scheduling_Home;