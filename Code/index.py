import json
from lunr import lunr
from tqdm import tqdm
import os


def main():
    documents = []
    files = []
    for filename in tqdm(os.listdir("Data")):
        doc = {}
        with open(f"Data/{filename}", "r") as f:
            data = json.loads(f.read())
        doc["id"] = os.path.splitext(filename)[0]
        doc["episode_num"] = os.path.splitext(filename)[0]
        doc["title"] = data["meta_data"]["title"]
        doc["body"] = data["transcription_data"]["text"]
        documents.append(doc)
        files.append(
            {
                "title": data["meta_data"]["title"],
                "episode_num": os.path.splitext(filename)[0],
            }
        )
    idx = lunr(ref="id", fields=("episode_num", "title", "body"), documents=documents)
    files_sorted = sorted(files, key=lambda x: float(x["episode_num"]))
    return idx, files_sorted


if __name__ == "__main__":
    idx, files = main()
    with open("index.json", "w") as f:
        json.dump(idx.serialize(), f)
    with open("files.json", "w") as f:
        json.dump({"files": files}, f)
