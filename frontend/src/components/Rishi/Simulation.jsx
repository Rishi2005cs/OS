import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const Simulation = ({ algorithm, onBackClick, onHomeClick }) => {
  const [requests, setRequests] = useState([]);
  const [initialPosition, setInitialPosition] = useState(50);
  const [newRequest, setNewRequest] = useState('');
  const [maxTrack, setMaxTrack] = useState(199);
  const [results, setResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per step
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [totalSeekTime, setTotalSeekTime] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [stepMovement, setStepMovement] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);

  useEffect(() => {
    resetSimulation();
  }, [algorithm]);

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const resetSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setRequests([]);
    setInitialPosition(50);
    setResults(null);
    setIsSimulating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSequence([]);
    setTotalSeekTime(0);
    setCurrentPosition(initialPosition);
    setStepMovement(0);
    setTotalMovement(0);
  };

  const calculateSequence = () => {
    let seq = [];
    let total = 0;
    let current = initialPosition;

    switch (algorithm.id) {
      case 'fcfs':
        seq = [...requests];
        break;
      case 'sstf':
        const remaining = [...requests];
        while (remaining.length > 0) {
          const closest = remaining.reduce((prev, curr) => {
            return Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev;
          });
          seq.push(closest);
          current = closest;
          remaining.splice(remaining.indexOf(closest), 1);
        }
        break;
      case 'scan':
        const sorted = [...requests].sort((a, b) => a - b);
        const head = initialPosition;
        const greater = sorted.filter(x => x >= head);
        const lesser = sorted.filter(x => x < head).reverse();
        seq = [...greater, ...lesser];
        break;
      default:
        seq = [...requests];
    }

    // Calculate total seek time
    let prev = initialPosition;
    for (const pos of seq) {
      total += Math.abs(pos - prev);
      prev = pos;
    }

    setSequence(seq);
    setTotalSeekTime(total);
    return seq;
  };

  const startSimulation = () => {
    if (isPaused) {
      setIsPaused(false);
      continueSimulation();
      return;
    }

    setIsSimulating(true);
    const seq = calculateSequence();
    let step = 0;
    setCurrentPosition(initialPosition);

    const interval = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setIsPaused(false);
        return;
      }

      setCurrentStep(step);
      const movement = Math.abs(currentPosition - seq[step]);
      setStepMovement(movement);
      setTotalMovement(prev => prev + movement);
      setCurrentPosition(seq[step]);
      step++;
    }, simulationSpeed);

    setSimulationInterval(interval);
  };

  const handleAddRequest = () => {
    const value = parseInt(newRequest);
    if (!isNaN(value) && value >= 0 && value <= maxTrack && !requests.includes(value)) {
      setRequests([...requests, value]);
      setNewRequest('');
    }
  };

  const handleRandomRequests = () => {
    const count = 8;
    const newRequests = [];
    while (newRequests.length < count) {
      const randomRequest = Math.floor(Math.random() * (maxTrack + 1));
      if (!newRequests.includes(randomRequest) && randomRequest !== initialPosition) {
        newRequests.push(randomRequest);
      }
    }
    setRequests(newRequests);
  };

  const pauseSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsPaused(true);
  };

  const continueSimulation = () => {
    const seq = sequence;
    let step = currentStep;

    const interval = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setIsPaused(false);
        return;
      }

      setCurrentStep(step);
      const movement = Math.abs(currentPosition - seq[step]);
      setStepMovement(movement);
      setTotalMovement(prev => prev + movement);
      setCurrentPosition(seq[step]);
      step++;
    }, simulationSpeed);

    setSimulationInterval(interval);
  };

  const handleRemoveRequest = (index) => {
    const newRequests = [...requests];
    newRequests.splice(index, 1);
    setRequests(newRequests);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between mb-6">
        <button 
          onClick={onBackClick}
          className="flex items-center text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          Back to Details
        </button>
        <button 
          onClick={onHomeClick}
          className="flex items-center text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          <FaHome className="mr-2" />
          Home
        </button>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 mb-4">{algorithm.name} Simulation</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Simulation Setup</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Simulation Speed</label>
            <select
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
              disabled={isSimulating}
            >
              <option value="2000">Slow</option>
              <option value="1000">Medium</option>
              <option value="500">Fast</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Initial Head Position</label>
            <input
              type="number"
              value={initialPosition}
              onChange={(e) => setInitialPosition(parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded-md"
              min="0"
              max={maxTrack}
              disabled={isSimulating}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Add Request</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                min="0"
                max={maxTrack}
                disabled={isSimulating}
              />
              <button
                onClick={handleAddRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                disabled={isSimulating}
              >
                Add
              </button>
              <button
                onClick={handleRandomRequests}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                disabled={isSimulating}
              >
                Random
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Request Queue</label>
            <div className="flex flex-wrap gap-2">
              {requests.map((request, index) => (
                <div
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{request}</span>
                  <button
                    onClick={() => handleRemoveRequest(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={isSimulating}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={startSimulation}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              disabled={(!isPaused && isSimulating) || requests.length === 0}
            >
              {isPaused ? 'Continue' : 'Start Simulation'}
            </button>
            <button
              onClick={pauseSimulation}
              className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300"
              disabled={!isSimulating || isPaused}
            >
              Pause
            </button>
            <button
              onClick={resetSimulation}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Visualization</h3>
          <div className="h-64 border rounded-lg p-4">
            <div className="relative h-full">
              {/* Track visualization */}
              <div className="absolute w-full h-2 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
              
              {/* Disk head */}
              <div 
                className="absolute w-6 h-6 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 animate-pulse shadow-lg"
                style={{
                  left: `${(currentPosition / maxTrack) * 100}%`,
                  top: '50%'
                }}
              ></div>

              {/* Request points */}
              {requests.map((pos, index) => (
                <div
                  key={index}
                  className={`absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${sequence.includes(pos) ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{
                    left: `${(pos / maxTrack) * 100}%`,
                    top: '50%'
                  }}
                ></div>
              ))}
            </div>

            {/* Statistics */}
            <div className="mt-4 text-sm">
              <p>Current Position: {currentPosition}</p>
              <p>Step Movement: {stepMovement}</p>
              <p>Total Movement: {totalMovement}</p>
              <p>Total Seek Time: {totalSeekTime}</p>
              <p>Sequence: {sequence.join(' → ')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Simulation;
