import { NextResponse } from "next/server";

type HPCEndpointResponse = {
	endpoints: {
		public_url: string;
	}[];
};

export async function GET() {
	const endpoints = (await getHPCEndpoint()).endpoints;
	if (endpoints.length === 0) {
		return NextResponse.json({ status: "offline" }, { status: 500 });
	}

	return NextResponse.json({ endpoint: endpoints[0].public_url });
}

async function getHPCEndpoint(): Promise<HPCEndpointResponse> {
	const response = await fetch("https://api.ngrok.com/endpoints", {
		cache: "no-store",
		headers: {
			Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
			"Ngrok-Version": "2",
		},
	});

	return response.json();
}
