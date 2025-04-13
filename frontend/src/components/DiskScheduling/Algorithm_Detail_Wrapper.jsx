import React from 'react';
import { useParams } from 'react-router-dom';
import Algorithm_Detail from './Algorithm_Detail';

const Algorithm_Detail_Wrapper = ({ algorithms, onBackClick, onSimulateClick }) => {
  const { id } = useParams();
  const algorithm = algorithms.find(algo => algo.id === id);

  if (!algorithm) {
    return <div>Algorithm not found</div>;
  }

  return (
    <Algorithm_Detail
      algorithm={algorithm}
      onBackClick={onBackClick}
      onSimulateClick={() => onSimulateClick(algorithm.id)}
    />
  );
};

export default Algorithm_Detail_Wrapper;