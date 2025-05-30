import React from 'react';

import { CensusData } from '../../types/CensusTypes';

import CensusCard from './CensusCard';

type Props = {
  census: CensusData;
};

const CensusDetails: React.FC<Props> = ({ census }) => {
  return <CensusCard census={census} />;
};

export default CensusDetails;
