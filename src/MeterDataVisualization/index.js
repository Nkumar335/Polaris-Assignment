import React, { useState } from 'react';
import './styles.css'
import DataVisualize from './DataVisualize.js'
import { Button } from 'react-bootstrap'
import ModalContainer from './ModalContainer.js'
import useDataParsing from './useFetchData.js'

function MeterDataVisualization() {

  const [show, setShow] = useState(false);

  // Dummy data for Initial Visualization
  const [selectedData, setSelectedData] = useState([
    {
      timestamp: '21-11-2023 10:00', m1_power_: '307', m2_power_: '21', m3_power_: '102', m4_power_: '545', cluster_meter_power_
        :
        "299"
    },
    {
      timestamp: '21-11-2023 10:09', m1_power_: '278', m2_power_: '116', m3_power_: '127', m4_power_: '457', cluster_meter_power_
        :
        "1012"
    }
  ])

  const [inputData, setInputData] = useState({
    startTime: '',
    endTime: '',
    meterNumber: []
  })

  const {parsedData, parseData} = useDataParsing();

  const changeHandler = (event) => {
    parseData(event.target.files[0]);
  };

  const transformKey = (key) => {
    return key.toLowerCase().replace(/\s+/g, '_').replace(/\(watts\)/g, '');
  };

  const transformedArray = parsedData.map((item) => {
    const transformedItem = {};
    for (const [key, value] of Object.entries(item)) {
      transformedItem[transformKey(key)] = value;
    }
    return transformedItem;
  });

  const handleShow = () => setShow(true);
  return (

    <div>
      <div className='header'>
        <h3>Data Visualization for Meters Reading</h3>
        <div className='view_btn'>
        <input
          type="file"
          name="file"
          onChange={changeHandler}
          accept=".csv"
        />
        <Button onClick={handleShow}>View Data</Button>
        </div>
      </div>

        <ModalContainer show={show} setShow={setShow} inputData={inputData} setInputData={setInputData} setSelectedData={setSelectedData} transformedArray={transformedArray} />

      <div className='graph_container'>
        <DataVisualize inputData={inputData} selectedData={selectedData} />
      </div>
    </div>

  );
}

export default MeterDataVisualization;
