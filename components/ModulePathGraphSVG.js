import React, { useEffect, useState } from "react";
import fetchGraphQL from "../hooks/fetchGraphQL";
import { GET_MODULE_EVENT } from "../hooks/queries";

const ModulePathGraphSVG = ({ userId, modulePath }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGraphQL(GET_MODULE_EVENT, {
          userId,
          modulePath,
        });
        setData(result.user[0].events[0]); // Store the single event object in data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, modulePath]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  if (!data) {
    return <p>Cannot find level from events</p>;
  }

  const radius = 100;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mx-auto mb-6 max-w-full">
      <h2 className="text-lg font-semibold">Level</h2>
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 300 230"
        className="mt-4 mx-auto"
      >
        <defs>
          <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(75, 192, 192, 1)" />
            <stop offset="100%" stopColor="rgba(75, 192, 192, 0.6)" />
          </radialGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="#333"
              floodOpacity="0.2"
            />
          </filter>
        </defs>
        <g transform="translate(150, 100)">
          <circle
            cx="0"
            cy="0"
            r="100"
            fill="url(#circleGradient)"
            filter="url(#shadow)"
          />
          <text
            x="0"
            y="12"
            fill="#ffffff"
            textAnchor="middle"
            fontSize="40"
            fontWeight="bold"
            style={{ textShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }}
          >
            {data.level}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ModulePathGraphSVG;
