import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import fetchGraphQL from "../hooks/fetchGraphQL";
import { USER_QUERY } from "../hooks/queries";
import UserInfo from "../components/UserInfo";
import UserAuditGraph from "../components/UserAuditGraph";
import LineChart from "../components/LineChartSVG";
import SkillsSVG from "../components/skillsSVG";
import ModulePathGraphSVG from "../components/ModulePathGraphSVG";

export function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGraphQL(USER_QUERY);

        if (!result || !result.user || result.user.length === 0) {
          // Redirect immediately if no user data is found using router.push
          router.push("/login");
          return;
        }

        setData(result.user[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array to avoid infinite loop

  const handleLogout = () => {
    // Clear the JWT from local storage or session storage
    localStorage.removeItem("jwt"); // or sessionStorage.removeItem("jwt");

    // Redirect to login page using router.push
    router.push("/login");
    return;
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const fullName = data ? `${data.firstName} ${data.lastName}` : "User";
  const userId = data ? data.id : null;
  const modulePath = "/bahrain/bh-module";

  return (
    <div className="mx-auto mt-5 ml-5 p-4 rounded-lg relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-white"
        title="Logout"
      >
        <img src="./logout.svg" alt="Logout" className="h-6 w-6" />
      </button>

      {/* Heading and Greeting */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-3xl font-bold text-left sm:ml-0 mb-4 sm:mb-0 sm:mt-0 mt-10">
          Hello, {fullName} ✨
        </h1>
      </div>

      <p className="text-left text-gray-600 mb-6">AKA {data?.login}</p>

      <div className="mb-10 p-4 rounded-lg flex flex-wrap gap-6">
        <ModulePathGraphSVG userId={userId} modulePath={modulePath} />
        {data && <UserInfo user={data} />}
        <UserAuditGraph />
        <SkillsSVG userId={userId} />
        <LineChart userId={userId} />
      </div>
    </div>
  );
}

export default Profile;
