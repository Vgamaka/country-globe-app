import React from 'react';

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];

const RegionFilter = ({ selectedRegion, onChange }) => {
  return (
    <div className="mb-4">
      <select
        className="form-select"
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Filter by region...</option>
        {regions.map((region) => (
          <option value={region} key={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilter;
