import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import Select from 'react-select';

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
  const [direction, setDirection] = useState('right'); // Add direction state
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
    setDirection('right');
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
        const scanSorted = [...requests].sort((a, b) => a - b);
        const scanHead = initialPosition;
        if (direction === 'right') {
          const greater = scanSorted.filter(x => x >= scanHead);
          const lesser = scanSorted.filter(x => x < scanHead).reverse();
          seq = [...greater, ...lesser];
        } else {
          const lesser = scanSorted.filter(x => x < scanHead);
          const greater = scanSorted.filter(x => x >= scanHead).reverse();
          seq = [...lesser, ...greater];
        }
        break;
      case 'cscan':
        const cscanSorted = [...requests].sort((a, b) => a - b);
        const cscanHead = initialPosition;
        if (direction === 'right') {
          const greater = cscanSorted.filter(x => x >= cscanHead);
          const lesser = cscanSorted.filter(x => x < cscanHead);
          seq = [...greater, ...lesser];
        } else {
          const lesser = cscanSorted.filter(x => x < cscanHead);
          const greater = cscanSorted.filter(x => x >= cscanHead);
          seq = [...lesser, ...greater];
        }
        break;
      case 'look':
        const lookSorted = [...requests].sort((a, b) => a - b);
        const lookHead = initialPosition;
        if (direction === 'right') {
          const greater = lookSorted.filter(x => x >= lookHead);
          const lesser = lookSorted.filter(x => x < lookHead).reverse();
          seq = [...greater, ...lesser];
        } else {
          const lesser = lookSorted.filter(x => x < lookHead);
          const greater = lookSorted.filter(x => x >= lookHead).reverse();
          seq = [...lesser, ...greater];
        }
        break;
      case 'clook':
        const clookSorted = [...requests].sort((a, b) => a - b);
        const clookHead = initialPosition;
        if (direction === 'right') {
          const greater = clookSorted.filter(x => x >= clookHead);
          const lesser = clookSorted.filter(x => x < clookHead);
          seq = [...greater, ...lesser];
        } else {
          const lesser = clookSorted.filter(x => x < clookHead);
          const greater = clookSorted.filter(x => x >= clookHead);
          seq = [...lesser, ...greater];
        }
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
      className="min-h-screen bg-gray-100 p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <button 
                onClick={onBackClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-base md:text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button 
                onClick={onHomeClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-base md:text-lg"
              >
                <FaHome className="text-lg" />
                Home
              </button>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">{algorithm.name} Simulation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Simulation Setup</h3>
              
              <div className="space-y-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-lg mb-2">Simulation Speed</label>
                  <Select
                    value={{ value: simulationSpeed, label: simulationSpeed === 2000 ? 'Slow' : simulationSpeed === 1000 ? 'Medium' : 'Fast' }}
                    onChange={(option) => setSimulationSpeed(option.value)}
                    options={[
                      { value: 2000, label: 'Slow' },
                      { value: 1000, label: 'Medium' },
                      { value: 500, label: 'Fast' }
                    ]}
                    isDisabled={isSimulating}
                    className="text-lg"
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0'
                      })
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-lg mb-2">Initial Head Position</label>
                  <input
                    type="number"
                    value={initialPosition}
                    onChange={(e) => setInitialPosition(parseInt(e.target.value) || 0)}
                    className="w-full p-3 border rounded-lg text-lg"
                    min="0"
                    max={maxTrack}
                    disabled={isSimulating}
                  />
                </div>

                {(algorithm.id === 'scan' || algorithm.id === 'cscan' || algorithm.id === 'look' || algorithm.id === 'clook') && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2">Head Movement Direction</label>
                    <Select
                      value={{ value: direction, label: direction.charAt(0).toUpperCase() + direction.slice(1) }}
                      onChange={(option) => setDirection(option.value)}
                      options={[
                        { value: 'right', label: 'Right' },
                        { value: 'left', label: 'Left' }
                      ]}
                      isDisabled={isSimulating}
                      className="text-lg"
                      styles={{
                        control: (base) => ({
                          ...base,
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0'
                        })
                      }}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-lg mb-2">Add Request</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={newRequest}
                      onChange={(e) => setNewRequest(e.target.value)}
                      className="flex-1 p-3 border rounded-lg text-lg"
                      min="0"
                      max={maxTrack}
                      disabled={isSimulating}
                    />
                    <button
                      onClick={handleAddRequest}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-medium"
                      disabled={isSimulating}
                    >
                      Add
                    </button>
                    <button
                      onClick={handleRandomRequests}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 text-lg font-medium"
                      disabled={isSimulating}
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-lg mb-2">Request Queue</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border min-h-[60px]">
                    {requests.map((request, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2 text-lg"
                      >
                        <span>{request}</span>
                        <button
                          onClick={() => handleRemoveRequest(index)}
                          className="text-red-600 hover:text-red-800 text-xl font-bold"
                          disabled={isSimulating}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startSimulation}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-medium"
                    disabled={(!isPaused && isSimulating) || requests.length === 0}
                  >
                    {isPaused ? 'Continue' : 'Start Simulation'}
                  </button>
                  <button
                    onClick={pauseSimulation}
                    className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-300 text-lg font-medium"
                    disabled={!isSimulating || isPaused}
                  >
                    Pause
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-lg font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Visualization</h3>
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="relative h-[400px] mb-8">
                  {/* Track visualization */}
                  <div className="absolute w-full h-3 bg-gray-200 top-1/2 transform -translate-y-1/2 rounded-full"></div>
                  
                  {/* Number line */}
                  <div className="absolute w-full top-3/4 flex justify-between px-2 text-base text-gray-600">
                    {[0, maxTrack/4, maxTrack/2, (3*maxTrack)/4, maxTrack].map((value) => (
                      <div key={value} className="relative">
                        <div className="absolute h-3 w-0.5 bg-gray-400 -top-3"></div>
                        <span className="absolute -translate-x-1/2 mt-2">{Math.round(value)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Disk head */}
                  <div 
                    className="absolute w-8 h-8 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 animate-pulse shadow-lg border-2 border-white"
                    style={{
                      left: `${(currentPosition / maxTrack) * 100}%`,
                      top: '50%'
                    }}
                  ></div>

                  {/* Request points */}
                  {requests.map((pos, index) => (
                    <div
                      key={index}
                      className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${sequence.includes(pos) ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}
                      style={{
                        left: `${(pos / maxTrack) * 100}%`,
                        top: '50%'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Media Controls */}
                <div className="flex justify-center gap-6 mb-8">
                  <button
                    onClick={() => {
                      if (currentStep > 0) {
                        setCurrentStep(prev => prev - 1);
                        const prevPos = sequence[currentStep - 1] || initialPosition;
                        const movement = Math.abs(currentPosition - prevPos);
                        setCurrentPosition(prevPos);
                        setStepMovement(movement);
                        setTotalMovement(prev => prev - movement);
                      }
                    }}
                    disabled={!isSimulating || currentStep === 0}
                    className="p-3 text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors duration-200 border-2 border-gray-300 rounded-lg hover:border-blue-600 disabled:border-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6l2.68 2.73z"/>
                    </svg>
                  </button>
                  <button
                    onClick={isPaused ? startSimulation : pauseSimulation}
                    disabled={!isSimulating}
                    className="p-3 text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors duration-200 border-2 border-gray-300 rounded-lg hover:border-blue-600 disabled:border-gray-200"
                  >
                    {isPaused ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep < sequence.length - 1) {
                        setCurrentStep(prev => prev + 1);
                        const nextPos = sequence[currentStep + 1];
                        const movement = Math.abs(currentPosition - nextPos);
                        setCurrentPosition(nextPos);
                        setStepMovement(movement);
                        setTotalMovement(prev => prev + movement);
                      }
                    }}
                    disabled={!isSimulating || currentStep >= sequence.length - 1}
                    className="p-3 text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors duration-200 border-2 border-gray-300 rounded-lg hover:border-blue-600 disabled:border-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.72 15.7l2.68-2.73H5v-1.94h10.4l-2.68-2.72 1.34-1.38L19 12l-4.94 5.07-1.34-1.37z"/>
                    </svg>
                  </button>
                </div>

                {/* Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-lg">
                  <p className="flex justify-between"><span className="font-medium">Current Position:</span> <span>{currentPosition}</span></p>
                  <p className="flex justify-between"><span className="font-medium">Step Movement:</span> <span>{stepMovement}</span></p>
                  <p className="flex justify-between"><span className="font-medium">Total Movement:</span> <span>{totalMovement}</span></p>
                  <p className="flex justify-between"><span className="font-medium">Total Seek Time:</span> <span>{totalSeekTime}</span></p>
                  <div className="pt-2 border-t">
                    <p className="font-medium mb-2">Sequence:</p>
                    <p className="text-base break-words">{sequence.join(' → ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Simulation;
