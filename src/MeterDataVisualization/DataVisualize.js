import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const formatKey = (key) => {
  if (key.startsWith('m1_power_')) {
    return key.replace('m1_power_', 'M1 Meter');
  } else if (key.startsWith('m2_power_')) {
    return key.replace('m2_power_', 'M2 Meter');
  } else if (key.startsWith('m3_power_')) {
    return key.replace('m3_power_', 'M3 Meter');
  } else if (key.startsWith('m4_power_')) {
    return key.replace('m4_power_', 'M4 Meter');
  } else if (key.startsWith('cluster_meter_power_')) {
    return key.replace('cluster_meter_power_', 'Master Meter');
  }
  return key;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{`Timestamp: ${data.timestamp}`}</p>
        {Object.keys(data).map((key) => (
          key !== 'timestamp' && <p key={key}>{`${formatKey(key)}: ${data[key]}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const DataVisualize = ({ inputData=[], selectedData = () => {} }) => {

  const [alert, setAlert] = useState(false);
  const meters = inputData.meterNumber;

  const meterColors = {
    M1: '#2B2A4C',
    M2: '#A9B388',
    M3: '#7071E8',
    M4: '#860A35',
    Master: '#ff0000',
  };

  const transformKey = (key) => {
    const lowercaseKey = key.toLowerCase().replace(/\s+/g, '_');
    if (lowercaseKey.includes('master')) {
      return 'cluster_meter_power_';
    } else {
      return lowercaseKey;
    }
  };

  useEffect(() => {

    // Check for timestamp range
    if(selectedData?.length === 0 ){
      toast.warn('Please Fill Timestamp range between 10:00 AM to 09:58 PM',{position: toast.POSITION.TOP_CENTER});
      return
    }
    // Check if the total power consumption exceeds 1500 Watts
    const totalPower = selectedData.reduce((total, data) => total + +data.cluster_meter_power_, 0);
    setAlert(totalPower > 1500);
    if (totalPower > 1500) {
      window.alert('Alert: Total power consumption exceeds 1500 Watts');
    }
  }, [selectedData, setAlert]);
  
  useEffect(() => {

    const alerts = [];
  
    // Iterate through selectedData and check for leakage current
    selectedData?.forEach((dataPoint) => {
      const totalPower = dataPoint.cluster_meter_power_;
      const sumOfIndividualPowers =
        dataPoint.m1_power_ + dataPoint.m2_power_ + dataPoint.m3_power_ + dataPoint.m4_power_;
  
      const leakageCurrent = totalPower - sumOfIndividualPowers;
  
      // Check if leakage current exceeds the threshold
      if (leakageCurrent > 300) {
        alerts.push(`Leakage current exceeds 300 Watts for timestamp ${dataPoint.timestamp}`);
      }
    });
  
    if (alerts.length > 0) {
      window.alert(alerts.join('\n'));
    }
  
  }, [selectedData]);
  
  return (
    <div style={{ width: '100%', height: '800px' }}>
      {alert && <div style={{ color: 'red', paddingTop: '10px', fontSize: '20px', fontWeight: '600' }}>Alert: Total power consumption exceeds 1500 Watts</div>}
      <div className='selected_data'>
        <p><span style={{fontWeight: '700'}}>Start Time:</span> {inputData?.startTime || selectedData[0]?.timestamp}</p>
        <p><span style={{fontWeight: '700'}}>End Time:</span> {inputData?.endTime || selectedData[1]?.timestamp}</p>
      </div>
      <LineChart
        width={1380}
        height={alert ? 540 : 580}
        data={selectedData}
        margin={{left: 30}}
      >
        <CartesianGrid strokeDasharray="3 3" stroke='#ccc'/>
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {meters.length > 0 ? (
          meters.map((meter) => (
            <Line
              key={`${meter}_line`}
              type="monotone"
              dataKey={transformKey(`${meter.toLowerCase()}_power_`)}
              stroke={meterColors[meter]}
              strokeDasharray="3 3"
              strokeWidth={3}
            />
          ))
        ) : (
        
          <>
            <Line
              key="M1_line"
              type="monotone"
              dataKey={'m1_power_'}
              stroke={meterColors["M1"]}
              strokeDasharray="3 3"
              strokeWidth={3}
            />
            <Line
              key="M2_line"
              type="monotone"
              dataKey={'m2_power_'}
              stroke={meterColors["M2"]}
              strokeDasharray="3 3"
              strokeWidth={3}
            />
          </>
        )}
      </LineChart>
    </div>
  );
};

export default DataVisualize;
