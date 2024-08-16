import os


def get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise Exception(f"Environment variable {name} is required")
    return value
