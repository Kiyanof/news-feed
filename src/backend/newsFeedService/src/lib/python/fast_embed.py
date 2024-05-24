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

def generate_sentences_array(text, kind="passage"):
    sentences = text.split(".")
    sentences = [sentence.strip() for sentence in sentences if sentence.strip()]
    sentences = [kind + ": " + sentence for sentence in sentences]
    return sentences

def generate_embedding(text, kind="passage"):
    sentences = generate_sentences_array(text, kind)
    documents: List[str] = sentences + [
        "fastembed is supported by and maintained by Qdrant."
    ]

    # This will trigger the model download and initialization
    embedding_model = TextEmbedding("BAAI/bge-small-en-v1.5", device="cpu", batch_size=1, max_seq_length=384, verbose=False, use_tqdm=False)
    print("The model BAAI/bge-small-en-v1.5 is ready to use.")
    embeddings_list = list(embedding_model.embed(documents))

    # Length of the embeddings = 384
    # The first element is the embedding of the input text

    return embeddings_list[0]

if __name__ == "__main__":
    text = sys.argv[1]
    kind = sys.argv[2] # "query" or "passage"
    embedding = generate_embedding(text, kind).tolist()
    # Restore the original stdout
    sys.stdout = original_stdout
    print("---start---\n", embedding, "\n---end---", file=sys.stderr) 