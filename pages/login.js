import { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "../components/LoginForm";

export function Login() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (username, password) => {
    // Create Base64 encoded credentials
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      // console.log("Token:", data);
      localStorage.setItem("jwt", data); // Store JWT in local storage
      router.push("/profile");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} error={error} />
    </div>
  );
}

export default Login;