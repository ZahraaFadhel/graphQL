// // hooks/useGraphQL.js
// import { useEffect, useState } from "react";

// const useGraphQL = (query) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("jwt");
//       if (!token) {
//         setError("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ query }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const result = await response.json();
//         setData(result.data);
//       } catch (fetchError) {
//         setError("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [query]);

//   return { data, error, loading };
// };

// export default useGraphQL;
