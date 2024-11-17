import React, { useEffect, useState } from "react";
import fetchGraphQL from "../hooks/fetchGraphQL";
import { XP_PER_PROJECT } from "../hooks/queries";

const XPGraphSVG = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGraphQL(XP_PER_PROJECT);
        setData(result.transaction);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const width = 700;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 20, left: 60 };

  // Filter data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const filteredData = data.filter((d) => new Date(d.createdAt) >= sixMonthsAgo);

  // Sort the data by date
  const sortedData = filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Compute cumulative amounts
  const cumulativeData = sortedData.reduce((acc, curr) => {
    const cumulativeAmount = (acc.length ? acc[acc.length - 1].amount : 0) + curr.amount;
    acc.push({ ...curr, amount: cumulativeAmount });
    return acc;
  }, []);

  const minAmount = Math.min(...cumulativeData.map((d) => d.amount));
  const maxAmount = Math.max(...cumulativeData.map((d) => d.amount));
  const minDate = new Date(Math.min(...cumulativeData.map((d) => new Date(d.createdAt).getTime())));
  const maxDate = new Date(Math.max(...cumulativeData.map((d) => new Date(d.createdAt).getTime())));

  const xScale = (date) =>
    ((new Date(date).getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * (width - margin.left - margin.right);
  const yScale = (amount) =>
    height - margin.top - margin.bottom - ((amount - minAmount) / (maxAmount - minAmount)) * (height - margin.top - margin.bottom);

  const linePath = cumulativeData
    .map((d, i) => {
      const x = xScale(d.createdAt);
      const y = yScale(d.amount);
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(" ");

  return (
    <div className="hidden lg:block bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold">Cumulative XP Growth Over Last 6 Months</h2>
      <svg width={width} height={height} className="mt-6 mx-auto">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Line path */}
          <path d={linePath} fill="none" stroke="rgba(75, 192, 192, 0.6)" strokeWidth="2" />

          {/* Data points */}
          {cumulativeData.map((d, index) => (
            <circle
              key={index}
              cx={xScale(d.createdAt)}
              cy={yScale(d.amount)}
              r="4"
              fill="rgba(75, 192, 192, 0.8)"
              stroke="#fff"
              strokeWidth="1"
            >
              <title>
                {new Date(d.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}: {d.amount}
              </title>
            </circle>
          ))}

          {/* Date labels */}
          {/* {cumulativeData.map((d, index) => (
            index % Math.ceil(cumulativeData.length / 10) === 0 && (
              <text
                key={index}
                x={xScale(d.createdAt)}
                y={height - margin.bottom + 30}
                fontSize="12"
                textAnchor="middle"
                transform={`rotate(290, ${xScale(d.createdAt)}, ${height - margin.bottom + 30})`}
              >
                {new Date(d.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </text>
            )
          ))} */}

          {/* Y-axis labels */}
          {Array.from({ length: 5 }).map((_, index) => (
            <text
              key={index}
              x={-20}
              y={yScale(minAmount + (maxAmount - minAmount) * (index / 4))}
              fontSize="12"
              textAnchor="end"
            >
              {(minAmount + (maxAmount - minAmount) * (index / 4)).toFixed(0)}
            </text>
          ))}

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, index) => (
            <line
              key={index}
              x1="0"
              y1={yScale(minAmount + (maxAmount - minAmount) * (index / 4))}
              x2={width - margin.left - margin.right}
              y2={yScale(minAmount + (maxAmount - minAmount) * (index / 4))}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default XPGraphSVG;
