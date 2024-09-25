"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { ServerStateResponse } from "./api/server-state/route";
import { duration } from "moment";

export default function Home() {

  const [epStatus, setEpStatus] = useState<"FETCHING" | "OFFLINE" | "ONLINE">("FETCHING")
  const [serverStateRequest, setServerStateRequest] = useState<"FETCHING" | "FAILED" | "SUCCESS">("FETCHING")
  const [serverState, setServerState] = useState<ServerStateResponse | null>(null)
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

    async function getServerState() {
      const response = await fetch("/api/server-state", { cache: "no-store" });
      const data: ServerStateResponse = await response.json();

      if (response.status === 200) {
        setServerStateRequest("SUCCESS")
        setServerState(data)
      } else {
        setServerStateRequest("FAILED")
      }
    }

    getServerState()
  }, [])

  return (
    <div className="flex gap-6 flex-col md:flex-row justify-center items-center h-screen w-full">
      {epStatus === "FETCHING" && <h1>Loading...</h1>}
      {epStatus === "ONLINE" && <EndpointOnline endpoint={endpoint} />}
      {epStatus === "OFFLINE" && <EndpointOffline />}
      {serverStateRequest === "FETCHING" && <h1>Loading...</h1>}
      {serverStateRequest === "SUCCESS" && <ServerState serverState={serverState!} />}
      {serverStateRequest === "FAILED" && <h1>Failed to fetch server state</h1>}
    </div>
  );
}

const EndpointOnline = ({ endpoint }: { endpoint: string }) => {
  return (
    <div className="border h-80 w-80 rounded-md flex flex-col justify-center items-center bg-green-700">
      <h1 className="text-3xl font-bold">HPC Server Online</h1>
      <p className="text-3xl">Endpoint:</p>
      <p className="text-2xl">{endpoint}</p>
    </div>
  );
}

const EndpointOffline = () => {
  return (
    <div className="border h-80 w-80 rounded-md flex flex-col justify-center items-center bg-red-400">
      <h1 className="text-3xl font-bold">HPC Server Offline!!!</h1>
      <p>Please contact CEO of Coding Club</p>
      <Image src="/aatis.jpg" alt="CEO" height={200} width={200} />
    </div>
  )
}

const ServerState = ({ serverState }: { serverState: ServerStateResponse }) => {
  return (
    <div className="border h-80 w-80 rounded-md flex flex-col justify-center items-center bg-blue-600">
      <h1 className="text-3xl font-bold">Server State</h1>
      <p className="text-xl">CPU: {serverState.cpu}%</p>
      <p className="text-xl">GPU: {serverState.gpu.util}%</p>
      <p className="text-xl">Memory: {serverState.mem}%</p>
      <p className="text-xl">Temperature (CPU): {serverState.temp.cpu}°C</p>
      <p className="text-xl">Temperature (GPU): {serverState.temp.gpu}°C</p>
      <p className="text-xl">Uptime: {duration(serverState.uptime * 1000).humanize()}</p>
    </div>
  )
}