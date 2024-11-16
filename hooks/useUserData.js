// hooks/useUserData.js
import { useEffect, useState } from "react";
import { fetchGraphQL } from "../fetchGraphQL";
import { USER_QUERY } from "./queries";

export default function useUserData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchGraphQL(USER_QUERY, token);

        setData(response.data.user[0]);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { data, error, loading };
}
