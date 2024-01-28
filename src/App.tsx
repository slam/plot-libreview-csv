import React, { useState } from 'react';
import Papa from 'papaparse';
import FileUpload from './FileUpload';
import GlucoseChart from './GlucoseChart';

interface RawData {
  'Device Timestamp': string;
  'Historic Glucose mg/dL': string;
  'Scan Glucose mg/dL': string;
}

const parseTimestamp = (timestampStr: string) => {
  const [datePart, timePart, ampm] = timestampStr.split(' ');
  const [month, day, year] = datePart.split('-').map(Number);
  let [hours, minutes] = timePart.split(':').map(Number);

  // Convert 12-hour format to 24-hour format
  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes);
};

const transformData = (rawData: RawData[]) => {
  return rawData.map(row => {
    return {
      timestamp: parseTimestamp(row['Device Timestamp']),
      historicGlucose: parseFloat(row['Historic Glucose mg/dL']) || null,
      scanGlucose: parseFloat(row['Scan Glucose mg/dL']) || null,
    };
  });
};

const App = () => {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event?.target?.result as string;
      if (text) {
        const lines = text.split(/\r\n|\n/);
        const csvContent = lines.slice(1).join("\n");
        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const transformedData = transformData(result.data as RawData[]);
            setData(transformedData);
          },
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <FileUpload onFileUpload={handleFileUpload} />
      <div style={{ height: "90vh", width: "100%" }}>
        <GlucoseChart data={data} />
      </div>
    </div>
  );
};

export default App;
