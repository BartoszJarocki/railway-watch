import { NextRequest, NextResponse } from 'next/server';

// Define allowed operation names
const ALLOWED_OPERATIONS = [
  'projects',
  'project',
  'serviceInstanceUpdate',
  'serviceInstanceDeploy',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const operationName = body.operationName;

    if (!operationName || !ALLOWED_OPERATIONS.includes(operationName)) {
      return NextResponse.json(
        { error: `Operation '${operationName}' not allowed` },
        { status: 403 }
      );
    }

    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RAILWAY_API_ACCOUNT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Railway API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute operation' },
      { status: 500 }
    );
  }
}
