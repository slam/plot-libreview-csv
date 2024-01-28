import React, { useState } from 'react';
import GlucoseCSVReader from './GlucoseCSVReader';
import GlucoseChart from './GlucoseChart';

const App = () => {
  const [data, setData] = useState<any[]>([]);

  return (
    <div>
      <GlucoseCSVReader onDataProcessed={setData} />
      <div style={{ height: "90vh", width: "100%" }}>
        <GlucoseChart data={data} />
      </div>
    </div>
  );
};

export default App;
