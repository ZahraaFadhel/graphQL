// hooks/fetchGraphQL.js

export default async function fetchGraphQL(query, variables = {}) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    window.location.href = "/login";
    // throw new Error("No token found. Please log in.");
  }

  const response = await fetch(
    "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  return result.data;
}
