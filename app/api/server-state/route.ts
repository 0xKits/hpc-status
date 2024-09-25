import { NextResponse } from "next/server";

export type ServerStateResponse = {
    cpu: number;
    mem: number;
    temp: {
        "cpu": number;
        "gpu": number;
    };
    uptime: number;
    gpu: {
        "name": string;
        "util": number;
        "mem": number;
    }
}

export async function GET() {
    const status = await getServerState()
    console.log(status)
    if (!status) {
        return NextResponse.json({ error: "Unable to fetch status" }, { status: 500 });
    }

    return NextResponse.json(status);
}


async function getServerState(): Promise<ServerStateResponse> {
  const response = await fetch(`${process.env.STATUS_ENDPOINT}`, {
    cache: "no-store",
  });

  console.log(response)

  return response.json();
}
