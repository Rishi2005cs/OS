import React from 'react';
import { useParams } from 'react-router-dom';
import AlgorithmDetail from './AlgorithmDetail';

const AlgorithmDetailWrapper = ({ algorithms, onBackClick, onSimulateClick }) => {
  const { id } = useParams();
  const algorithm = algorithms.find(algo => algo.id === id);

  if (!algorithm) {
    return <div>Algorithm not found</div>;
  }

  return (
    <AlgorithmDetail
      algorithm={algorithm}
      onBackClick={onBackClick}
      onSimulateClick={() => onSimulateClick(algorithm.id)}
    />
  );
};

export default AlgorithmDetailWrapper;