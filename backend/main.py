import logging
from typing import List

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jigglejiggle.clustering import generate_genre_clusters
from jigglejiggle.embedding import EmbeddingService
from jigglejiggle.util import get_env
from openai import OpenAI
from pydantic import BaseModel


class ClusterRequest(BaseModel):
    genres: List[str]
    n_clusters: int


logger = logging.getLogger("uvicorn.error")

load_dotenv()


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_KEY = get_env("OPENAI_KEY")
SPOTIFY_CLIENT_ID = get_env("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = get_env("SPOTIFY_CLIENT_SECRET")
logger.info(
    f"Starting with OPENAI_KEY={OPENAI_KEY} SPOTIFY_CLIENT_ID={SPOTIFY_CLIENT_ID} SPOTIFY_CLIENT_SECRET={SPOTIFY_CLIENT_SECRET}"
)

openai = OpenAI(api_key=OPENAI_KEY)
embedding_service = EmbeddingService(openai, logger=logger)


@app.post("/api/clusters")
def generate_clusters(request: ClusterRequest):
    if len(request.genres) < 10:
        return {"error": "At least 10 genres are required"}
    elif request.n_clusters < 2:
        return {"error": "At least 2 clusters are required"}
    elif request.n_clusters > len(request.genres) or request.n_clusters > 15:
        return {"error": "At most 15 clusters are allowed."}

    embeddings, total_tokens = embedding_service.embedd_genres(request.genres)
    embedding_service.update_existing_embeddings(embeddings)

    embedding_vectors = np.array(list(embeddings.values()))
    kmeans = generate_clusters(embedding_vectors, request.n_clusters)
    genre_clusters = generate_genre_clusters(embeddings, kmeans)

    return {"clusters": genre_clusters, "total_tokens": total_tokens}


@app.get("/test")
def test():
    return {"test": "test"}
