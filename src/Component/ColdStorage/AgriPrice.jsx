import React, { useState } from "react";
import axios from "axios";

const Agriprice = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:2020/run/predict", {
        data: [category, state, district],
      });

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  return (
    <div>
      <h2>Agriprice Market Price Prediction</h2>
      <input
        type="text"
        placeholder="Enter State"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="F&V (F&V, Spices)">F&V (F&V, Spices)</option>
        <option value="Marine & Fishery">Marine & Fishery</option>
        <option value="Dairy">Dairy</option>
        {/* Add all other categories here */}
      </select>
      <button onClick={fetchData}>Predict</button>

      <div>
        <h3>Results:</h3>
        {results.length === 0 ? (
          <p>No data found</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Project</th>
                <th>Sector</th>
                <th>District</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (   
                <tr key={index}>
                  <td>{item.Project}</td>
                  <td>{item.Sector}</td>
                  <td>{item.District}</td>
                  <td>{item.State}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Agriprice;
