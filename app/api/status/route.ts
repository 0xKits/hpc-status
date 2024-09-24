import { NextResponse } from "next/server";

type HPCEndpointResponse = {
    endpoints: {
        public_url: string;
    }[]
}

export async function GET() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const endpoints = (await getHPCEndpoint()).endpoints;
    console.log(endpoints)
    if (endpoints.length === 0) {
        return NextResponse.json({ status: "offline" }, { status: 500 });
    }


    return NextResponse.json({ endpoint: endpoints[0].public_url });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getHPCEndpoint(): Promise<HPCEndpointResponse> {
  const response = await fetch("https://api.ngrok.com/endpoints", {

    headers: {
        "Authorization": `Bearer ${process.env.NGROK_API_KEY}`,
        "Ngrok-Version": "2"
    }
  });

  return response.json();
}