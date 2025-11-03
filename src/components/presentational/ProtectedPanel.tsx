import React, { useEffect, useState } from "react";
import axios from "axios";

export const ProtectedPanel = () => {
  const [data, setData] = useState(null);

  useEffect( () => {
        const token = localStorage.getItem("token");
        console.log("Token is ", token)
  }, [])
  useEffect(() => {
    // your JWT token (store it in localStorage or context normally)
    const token = localStorage.getItem("token");
    axios.get("/testroles/auth/protected", {
        params: { user: "jinga" }, // same as ?user=jinga
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // If you’re hitting HTTPS with a self-signed certificate:
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
      });
  }, []);

  return (
    <div>
      <h2>Protected API Response</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
