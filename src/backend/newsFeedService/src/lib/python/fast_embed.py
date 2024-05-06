# fast_embed.py
import sys
from fastembed import TextEmbedding
from typing import List
import os

os.environ["TQDM_DISABLE"] = "True"
# Save the original stdout
original_stdout = sys.stdout

# Redirect stdout to null
sys.stdout = open(os.devnull, 'w')

def generate_embedding(text):
    documents: List[str] = [
        text,
        "fastembed is supported by and maintained by Qdrant.",
    ]

    # This will trigger the model download and initialization
    embedding_model = TextEmbedding()
    print("The model BAAI/bge-small-en-v1.5 is ready to use.")

    embeddings_generator = embedding_model.embed(documents)  # reminder this is a generator
    embeddings_list = list(embedding_model.embed(documents))

    # The first element is the embedding of the input text
    return embeddings_list[0]

if __name__ == "__main__":
    text = sys.argv[1]
    embedding = generate_embedding(text)
    # Restore the original stdout
    sys.stdout = original_stdout
    print("---start---\n", embedding, "\n---end---", file=sys.stderr)
