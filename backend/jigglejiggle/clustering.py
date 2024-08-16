from collections import defaultdict
from typing import Dict, List

from numpy import array
from sklearn.cluster import KMeans


def generate_clusters(vectors: List[array], n_clusters, random_state=0) -> KMeans:
    kmeans = KMeans(n_clusters, random_state=random_state)
    kmeans.fit(vectors)

    return kmeans


def generate_genre_clusters(
    genre_embedding_dict: Dict[str, array], kmeans: KMeans
) -> Dict[str, List[str]]:
    genre_clusters = defaultdict(list)
    for genre, embedding in genre_embedding_dict.items():
        cluster = kmeans.predict([embedding])[0]
        cluster = f"cluster_{cluster}"
        genre_clusters[cluster].append(genre)
    return genre_clusters
