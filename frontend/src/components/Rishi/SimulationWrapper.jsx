import React from 'react';
import { useParams } from 'react-router-dom';
import Simulation from './Simulation';

const SimulationWrapper = ({ algorithms, onBackClick, onHomeClick }) => {
  const { id } = useParams();
  const algorithm = algorithms.find(algo => algo.id === id);

  if (!algorithm) {
    return <div>Algorithm not found</div>;
  }

  return (
    <Simulation
      algorithm={algorithm}
      onBackClick={() => onBackClick(algorithm.id)}
      onHomeClick={onHomeClick}
    />
  );
};

export default SimulationWrapper;