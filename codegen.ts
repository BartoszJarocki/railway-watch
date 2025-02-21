// codegen.ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'https://backboard.railway.com/graphql/v2': {
      headers: {
        Authorization: `Bearer ${process.env.RAILWAY_API_TOKEN}`,
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/lib/network/gql/': {
      preset: 'client',
      config: {
        fetcher: {
          endpoint: 'https://backboard.railway.com/graphql/v2',
          fetchParams: `{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${process.env.RAILWAY_API_TOKEN}\`
            }
          }`,
        },
      },
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
