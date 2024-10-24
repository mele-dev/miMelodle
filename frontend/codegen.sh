#!/usr/bin/env bash

curl -k https://localhost/backend/docs/json > schemas/backendSchema.json

npx prettier ./schemas/backendSchema.json --write

orval --config ./orval.config.ts
