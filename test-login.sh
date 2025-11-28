#!/bin/sh
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@multipoles.com","password":"Admin@123"}'
