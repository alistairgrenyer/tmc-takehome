import os
import sys
from pathlib import Path

# Ensure the backend directory is on sys.path so `import app` works
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Ensure app config can import without a .env present during tests
# Use a local SQLite file as a benign default for import-time engine creation.
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///./test.db")
