import sys
import os

# Add the project root to the python path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from mangum import Mangum

# Export the handler for Vercel
handler = Mangum(app)

# Vercel's Python runtime will look for the 'app' variable, 
# but Mangum handler is often more reliable for FastAPI.
# Let's keep both.
app = handler
