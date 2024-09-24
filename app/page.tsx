"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [epStatus, setEpStatus] = useState<"FETCHING" | "OFFLINE" | "ONLINE">("FETCHING")
  const [endpoint, setEndpoint] = useState<string>("")

  useEffect(() => {
    async function updateEndpoint() {
      const response = await fetch("/api/status", { cache: "no-store" });
      const data = await response.json();


      if (response.status === 200) {
        setEndpoint(data.endpoint)
        setEpStatus("ONLINE")
      } else if (response.status === 500) {
        setEpStatus("OFFLINE")
      }
    }
    updateEndpoint()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      {epStatus === "FETCHING" && <h1>Loading...</h1>}
      {epStatus === "ONLINE" && <EndpointOnline endpoint={endpoint} />}
      {epStatus === "OFFLINE" && <EndpointOffline />}
    </div>
  );
}

const EndpointOnline = ({ endpoint }: { endpoint: string }) => {
  return (
    <div className="border h-80 w-80 rounded-md flex flex-col justify-center items-center bg-green-400">
      <h1 className="text-3xl text-black">HPC Server Online!!!</h1>
      <p className="text-black">Endpoint: {endpoint}</p>
    </div>
  );
}

const EndpointOffline = () => {
  return (
    <div className="border h-80 w-80 rounded-md flex flex-col justify-center items-center bg-red-400">
      <h1 className="text-3xl">HPC Server Offline!!!</h1>
      <p>Please contact CEO of Coding Club</p>
      <Image src="/aatis.jpg" alt="CEO" height={200} width={200}/>
    </div>
  )
}
