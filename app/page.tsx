"use client"

import { useEffect, useState } from "react";

export default function Home() {

  const [endpoint, setEndpoint] = useState<string>("")

  useEffect(() => {
    async function updateEndpoint() {
      const response = await fetch("/api/status");
      const data = await response.json();

      console.log(data)

      setEndpoint(data.endpoint)
    }
    updateEndpoint()
  }, [])

  return (
    <div>
      {endpoint}
    </div>
  );
}

