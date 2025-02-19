import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';
import {
  GET_PROJECTS,
  SCALE_SERVICE,
  DEPLOY_SERVICE,
} from '@/lib/network/operations';

if (!process.env.RAILWAY_API_TOKEN) {
  throw new Error('RAILWAY_API_TOKEN is not defined');
}

const ALLOWED_OPERATIONS = {
  GET_PROJECTS,
  SCALE_SERVICE,
  DEPLOY_SERVICE,
} as const;

type OperationType = keyof typeof ALLOWED_OPERATIONS;

const client = new GraphQLClient('https://backboard.railway.app/graphql/v2', {
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!(body.operation in ALLOWED_OPERATIONS)) {
      return NextResponse.json(
        { error: `Operation '${body.operation}' not allowed` },
        { status: 403 }
      );
    }

    const response = await client.request(
      ALLOWED_OPERATIONS[body.operation as OperationType],
      body.variables
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Railway API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute operation' },
      { status: 500 }
    );
  }
}
