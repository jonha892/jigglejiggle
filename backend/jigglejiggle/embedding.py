import json
import logging
from pathlib import Path
from typing import Dict, List

import tqdm
from openai import OpenAI


class EmbeddingService:
    def __init__(
        self,
        openai_client: OpenAI,
        logger=None,
        existing_embedding_path: str = "data/existing_embeddings.json",
    ) -> None:
        self.openai_client = openai_client

        existing_embeddings_path = Path(existing_embedding_path)
        if not existing_embeddings_path.exists():
            existing_embeddings_path.touch()

        self.existing_embeddings_path = existing_embeddings_path
        with open(existing_embeddings_path, "r") as f:
            self.existing_embeddings = json.load(f)

        if logger is not None:
            self.logger = logger
        else:
            self.logger = logging.getLogger("uvicorn.error")
        self.logger.info(f"Loaded {len(self.existing_embeddings)} existing embeddings")

    def embedd_genres(
        self,
        genres: List[str],
        existing_embeddings: Dict[str, List[float]],
        model="text-embedding-3-small",
    ):
        total_tokens = 0
        embeddings = {}
        self.logger.info(f"Embedding {len(genres)} genres")
        for _, genre in tqdm.tqdm(enumerate(genres)):
            if genre in existing_embeddings:
                embeddings[genre] = existing_embeddings[genre]
                continue
            response = self.openai_client.embeddings.create(input=genre, model=model)
            embeddings[genre] = response.data[0].embedding
            total_tokens += response.usage.total_tokens
        return embeddings, total_tokens

    def update_existing_embeddings(self, new_embeddings: Dict[str, List[float]]):
        updated_embeddings = {**self.existing_embeddings, **new_embeddings}
        with open(self.existing_embeddings_path, "w") as f:
            json.dump(updated_embeddings, f)
