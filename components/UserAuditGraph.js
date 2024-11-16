import React, { useState, useEffect } from "react";
import fetchGraphQL from "../hooks/fetchGraphQL";
import { GET_USER_WITH_AUDIT } from "../hooks/queries";

const UserAuditGraph = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGraphQL(GET_USER_WITH_AUDIT);
        if (response.errors) {
          throw new Error(response.errors[0].message);
        }
        setData(response.user[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const { totalUp = 0, totalDown = 0, auditRatio = "N/A" } = data || {};
  const totalUpMB = totalUp / 1048576;
  const totalDownMB = totalDown / 1048576;
  const maxValue = Math.max(totalUpMB, totalDownMB);
  const barWidth = 100;
  const heightScale = maxValue ? 150 / maxValue : 0;
  const svgHeight = 200;
  const svgWidth = 330;

  return (
    <div className="bg-white shadow-md rounded-lg mx-auto mb-6 max-w-sm p-2">
      <h2 className="text-lg font-semibold m-2">User Audit Graph</h2>
      <p className="text-sm text-gray-700 m-2">
        Audit Ratio:{" "}
        <strong>
          {typeof auditRatio === "number" ? auditRatio.toFixed(1) : "N/A"}
        </strong>
      </p>
      <div className="flex justify-center">
        <svg width={svgWidth} height={svgHeight}>
          {/* X-Axis */}
          <line
            x1="40"
            y1={svgHeight - 20}
            x2={svgWidth - 30}
            y2={svgHeight - 20}
            stroke="black"
          />

          {/* Y-Axis */}
          <line x1="40" y1="0" x2="40" y2={svgHeight - 20} stroke="black" />

          {/* X-Axis Arrow */}
          <polygon
            points={`${svgWidth - 30},${svgHeight - 20} ${svgWidth - 40},${
              svgHeight - 10
            } ${svgWidth - 40},${svgHeight - 30}`}
            fill="black"
          />

          {/* Y-Axis Arrow */}
          <polygon points={`40,0 30,10 50,10`} fill="black" />

          {/* Bars */}
          <rect
            x="60"
            y={svgHeight - totalUpMB * heightScale - 20}
            width={barWidth}
            height={totalUpMB * heightScale}
            fill="rgba(75, 192, 192, 0.6)"
          />
          <rect
            x="180"
            y={svgHeight - totalDownMB * heightScale - 20}
            width={barWidth}
            height={totalDownMB * heightScale}
            fill="rgba(255, 206, 86, 0.6)"
          />

          {/* Labels */}
          <text x="110" y={svgHeight - 5} textAnchor="middle" fill="black">
            Total Up
          </text>
          <text x="230" y={svgHeight - 5} textAnchor="middle" fill="black">
            Total Down
          </text>

          {/* Values */}
          <text
            x="110"
            y={svgHeight - totalUpMB * heightScale - 25}
            textAnchor="middle"
            fill="black"
          >
            {totalUpMB.toFixed(2)} MB
          </text>
          <text
            x="230"
            y={svgHeight - totalDownMB * heightScale - 25}
            textAnchor="middle"
            fill="black"
          >
            {totalDownMB.toFixed(2)} MB
          </text>
        </svg>
      </div>
    </div>
  );
};

export default UserAuditGraph;
