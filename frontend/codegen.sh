#!/usr/bin/env bash

curl -k https://192.168.1.5/backend/docs/json > schemas/backendSchema.json

npx prettier ./schemas/backendSchema.json --write

# FIXME: Codegen now complains about every time we call SafeType.Nullable().
orval --config ./orval.config.ts
