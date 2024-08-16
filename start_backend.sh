#!/bin/bash

# Start the backend
source .venv/bin/activate
cd backend
fastapi dev main.py