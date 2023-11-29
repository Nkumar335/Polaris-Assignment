import { useState } from "react";
import Papa from "papaparse";

const useDataParsing = () => {
    const [parsedData, setParsedData] = useState([]);
  
    const parseData = (file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setParsedData(results.data);
        },
      });
    };
  
    return { parsedData, parseData };
  };

export default useDataParsing;