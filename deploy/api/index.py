import sys
import os

# Add the project root to the python path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import app

# This is the entry point for Vercel
# Vercel's Python runtime will look for the 'app' variable
