import React from 'react';
import Papa from 'papaparse';

interface RawData {
  'Device Timestamp': string;
  'Historic Glucose mg/dL': string;
  'Scan Glucose mg/dL': string;
}

interface GlucoseCSVReaderProps {
  onDataProcessed: (data: any[]) => void;
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

const GlucoseCSVReader: React.FC<GlucoseCSVReaderProps> = ({ onDataProcessed }) => {
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event?.target?.result as string;
      if (text) {
        const lines = text.split(/\r\n|\n/);
        const csvContent = lines.slice(1).join("\n"); // Remove the first descriptive row
        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const transformedData = transformData(result.data as RawData[]);
            onDataProcessed(transformedData);
          },
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
    </div>
  );
};

export default GlucoseCSVReader;
