import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/your-real-endpoint") // Replace this with real backend route
      .then((response) => {
        if (!response.ok) {
          throw new Error("API not found or returned error");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("API did not return an array:", data);
          setError("Invalid data format from API");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Backend Data</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name || item.title || JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
