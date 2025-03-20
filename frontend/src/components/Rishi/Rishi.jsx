import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Wrapper components to handle routing parameters
const AlgorithmDetailWrapper = ({ algorithms, onBackClick, onSimulateClick }) => {
  const { id } = useParams();
  const algorithm = algorithms.find(algo => algo.id === id);
  return <AlgorithmDetail algorithm={algorithm} onBackClick={onBackClick} onSimulateClick={() => onSimulateClick(id)} />;
};

const SimulationWrapper = ({ algorithms, onBackClick, onHomeClick }) => {
  const { id } = useParams();
  const algorithm = algorithms.find(algo => algo.id === id);
  return <Simulation algorithm={algorithm} onBackClick={() => onBackClick(id)} onHomeClick={onHomeClick} />;
};
import DiskSchedulingHome from './DiskSchedulingHome';
import AlgorithmDetail from './AlgorithmDetail';
import Simulation from './Simulation';

const Rishi = () => {
  const navigate = useNavigate();

  // List of disk scheduling algorithms
  const algorithms = [
    {
      id: 'fcfs',
      name: 'First Come First Served (FCFS)',
      description: 'The simplest disk scheduling algorithm that services requests in the order they arrive.',
      details: 'FCFS is straightforward but can lead to long seek times if requests are far apart on the disk.'
    },
    {
      id: 'sstf',
      name: 'Shortest Seek Time First (SSTF)',
      description: 'Services the request that requires the least head movement from the current position.',
      details: 'SSTF minimizes seek time but may cause starvation of requests far from the head position.'
    },
    {
      id: 'scan',
      name: 'SCAN (Elevator)',
      description: 'The disk arm moves in one direction servicing requests until it reaches the end, then reverses direction.',
      details: 'SCAN provides better performance than FCFS and prevents starvation.'
    },
    {
      id: 'cscan',
      name: 'Circular SCAN (C-SCAN)',
      description: 'Similar to SCAN, but when the arm reaches the end, it immediately returns to the beginning without servicing requests on the return trip.',
      details: 'C-SCAN provides more uniform wait times than SCAN.'
    },
    {
      id: 'look',
      name: 'LOOK',
      description: 'Similar to SCAN, but the arm only goes as far as the last request in each direction.',
      details: 'LOOK improves on SCAN by avoiding unnecessary movement to the end of the disk.'
    },
    {
      id: 'clook',
      name: 'C-LOOK',
      description: 'Similar to C-SCAN, but the arm only goes as far as the last request in each direction before returning to the beginning.',
      details: 'C-LOOK improves on C-SCAN by avoiding unnecessary movement to the end of the disk.'
    }
  ];

  // Handle algorithm selection
  const handleAlgorithmSelect = (algorithmId) => {
    navigate(`/algorithm/${algorithmId}`);
  };

  // Navigate to simulation
  const goToSimulation = (algorithmId) => {
    navigate(`/simulation/${algorithmId}`);
  };

  // Go back to home
  const goToHome = () => {
    navigate('/');
  };

  // Go back to algorithm detail
  const goToDetail = (algorithmId) => {
    navigate(`/algorithm/${algorithmId}`);
  };

  return (
    <div className="page-transition min-h-screen p-4" style={{ backgroundColor: 'var(--background-light)' }}>
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-lg shadow-lg mb-6 transition-all duration-300 hover:shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Disk Scheduling Algorithms</h1>
        <p className="text-xl opacity-90">Learn and simulate different disk scheduling techniques</p>
      </header>

      <div className="page-transition">
        <Routes>
          <Route path="/" element={<DiskSchedulingHome algorithms={algorithms} onAlgorithmSelect={handleAlgorithmSelect} />} />
          <Route path="/algorithm/:id" element={<AlgorithmDetailWrapper algorithms={algorithms} onBackClick={goToHome} onSimulateClick={goToSimulation} />} />
          <Route path="/simulation/:id" element={<SimulationWrapper algorithms={algorithms} onBackClick={goToDetail} onHomeClick={goToHome} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Rishi;