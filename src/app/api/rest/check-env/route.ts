import { NextRequest, NextResponse } from "next/server";

export interface EnvCheckResponse {
  exists: boolean;
  variableName: string;
  timestamp: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const variable = searchParams.get("variable");

    if (!variable) {
      return NextResponse.json(
        { error: "Variable name is required" },
        { status: 400 },
      );
    }

    const response: EnvCheckResponse = {
      exists: !!process.env[variable],
      variableName: variable,
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to check environment variable" },
      { status: 500 },
    );
  }
}
