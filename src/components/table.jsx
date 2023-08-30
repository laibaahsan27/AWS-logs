import React, { useState, useEffect } from "react";
import DATA from "../MOCK_DATA.json";

export default function Table() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [logData, setLogData] = useState(DATA);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(Object.keys(DATA[0]));
  const [selectedColumn, setSelectedColumn] = useState(""); // Here's the added line
  const [searchValue, setSearchValue] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(Object.keys(DATA[0]));

  useEffect(() => {
    setVisibleColumns(Object.keys(DATA[0]));
  }, []);

  const handleSearch = () => {
    setVisibleColumns(selectedColumns);

    let results = logData;

    if (startTime && endTime) {
      results = results.filter((entry) => {
        const entryTime = new Date(entry.timestamp);
        const start = new Date(startTime);
        const end = new Date(endTime);
        return entryTime >= start && entryTime <= end;
      });
    }

    if (selectedColumn && searchValue) {
      results = results.filter((entry) =>
        String(entry[selectedColumn]).includes(searchValue)
      );
    }

    setFilteredData(results);
    setShowFiltered(true);
  };

  const toggleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns((prevColumns) =>
        prevColumns.filter((col) => col !== column)
      );
    } else {
      setSelectedColumns((prevColumns) => [...prevColumns, column]);
    }
  };

  return (
    <div>
      <div className="uppercon">
        <h1>FILTERS:</h1>
        <div className="firstfilter">
          <label>
            <h2>Select column:</h2>
            <select
              className="selcol"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="">-- Choose a column --</option>
              {Object.keys(logData[0]).map((key) => (
                <option key={key} value={key}>
                  {key.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            <h2>Search:</h2>
            <input
              className="inputsearch"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        <div className="showcolsdiv">
          <h2> Show Columns:</h2>
          {Object.keys(logData[0]).map((key) => (
            <button
              key={key}
              className={selectedColumns.includes(key) ? "selected-column" : ""}
              onClick={() => toggleColumnSelection(key)}
            >
              {key.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
        <div className="timestampdiv">
          <label>
            <h2>Start Time:</h2>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            <h2>End Time:</h2>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>

        <button className="searchbtn" onClick={handleSearch}>
          Get Results
        </button>
      </div>

      <table className="tableD" border="1">
        <thead>
          <tr>
            {visibleColumns.map((key) => (
              <th className="tableheading" key={key}>
                {key.replace("_", " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(showFiltered ? filteredData : logData).map((entry, rowIndex) => (
            <tr key={rowIndex}>
              {visibleColumns.map((key, index) => (
                <td className="tabledata" key={index}>
                  {entry[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
