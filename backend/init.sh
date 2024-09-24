#!/usr/bin/env sh

# Install dependencies
npm install

# Generate db types (blocking)
npx pgtyped --config pgtyped-config.json

# Generate db types (watch mode, in the background)
npx pgtyped --watch --config pgtyped-config.json &

# run fastify
npm run dev
