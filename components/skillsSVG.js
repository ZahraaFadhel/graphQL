import React, { useEffect, useState } from "react";
import fetchGraphQL from "../hooks/fetchGraphQL"; // Assumes you have a fetchGraphQL function
import { GET_SKILLS } from "../hooks/queries"; // Your GraphQL query

const SkillsSVG = ({ userId }) => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch skills data
    const fetchSkills = async () => {
      try {
        const result = await fetchGraphQL(GET_SKILLS, { userId });
        const skills = result.transaction;
        const sortedSkills = [...skills].sort((a, b) => b.amount - a.amount);
        setSkillsData(sortedSkills);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchSkills();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const totalAmount = skillsData.reduce((sum, skill) => sum + skill.amount, 0);
  let startAngle = 0;

  const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

  const outerRadius = 100; // Smaller outer radius
  const innerRadius = 50; // Smaller inner radius

  // Function to generate colors dynamically
  const generateColor = (index) => {
    return index % 2 === 0
      ? `rgba(${75 + index * 10}, ${192 - index * 5}, ${192 - index * 5}, ${
          0.6 + index * 0.05
        })`
      : `rgba(${255 - index * 5}, ${206 - index * 10}, ${86}, ${
          0.6 + index * 0.05
        })`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mx-auto mb-6 max-w-sm">
      <h2 className="text-lg font-semibold text-left mb-4">Best Skills</h2>
      {/* Centered SVG Pie Chart */}
      <div className="flex justify-center">
        <svg
          width="180"
          height="180"
          viewBox={`-${outerRadius} -${outerRadius} ${outerRadius * 2} ${outerRadius * 2}`}
        >
          {skillsData.map((skill, index) => {
            const { type, amount } = skill;
            const percentage = amount / totalAmount;
            const angle = percentage * 360;
            const endAngle = startAngle + angle;
            const largeArcFlag = angle > 180 ? 1 : 0;

            const x1 = outerRadius * Math.cos(degreesToRadians(startAngle));
            const y1 = outerRadius * Math.sin(degreesToRadians(startAngle));
            const x2 = outerRadius * Math.cos(degreesToRadians(endAngle));
            const y2 = outerRadius * Math.sin(degreesToRadians(endAngle));

            startAngle += angle;

            return (
              <g key={type}>
                <path
                  d={`M 0 0 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={generateColor(index)}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <title>{`${type.replace("skill_", "")}: ${(
                  percentage * 100
                ).toFixed(1)}%`}</title>
              </g>
            );
          })}
          <circle cx="0" cy="0" r={innerRadius} fill="#fff" />
        </svg>
      </div>

      {/* Dynamic Skills Key - Centered */}
      <div className="mt-6">
        <h2 className="font-semibold mb-8 text-left">Skills Color Key</h2>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-4">
          {skillsData.map((skill, index) => (
            <li key={skill.type} className="flex items-center w-1/3 mb-0">
              <span
                className="inline-block w-6 h-6 mr-2"
                style={{ backgroundColor: generateColor(index) }}
              ></span>
              <span className="text-sm">
                {skill.type.replace("skill_", "")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillsSVG;
