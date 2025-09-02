from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router

app = FastAPI(title="User Manager API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(o) for o in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)

@app.get("/", tags=["health"]) 
def root():
    return {"status": "ok"}

@app.get("/health", tags=["health"]) 
def health():
    return {"status": "healthy"}

# API routes
app.include_router(api_router)
