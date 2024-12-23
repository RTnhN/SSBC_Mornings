const transcriptsUl = document.getElementById("transcripts")
const searchBox = document.getElementById('searchBox');

const baseURL = "https://rtnhn-transcriptions.github.io/base-transcribe/"

async function fetchFiles() {
  const response = await fetch(baseURL + 'files.json');
  const json = await response.json();
  return json.files;
}

async function populateList() {
  const files = await fetchFiles();
  files.forEach(makeEpisode);
}

async function getFileObj(episode_num) {
  const response = await fetch(baseURL + 'files.json');
  const json = await response.json();
  return json.files.find(file => file.episode_num === episode_num);
}


async function makeEpisode(fileObj) {
  if (typeof fileObj === "string") {
    fileObj = await getFileObj(fileObj);
  }
  const episode = document.createElement("li")
  const link = document.createElement("a")
  link.href = "SmartTranscripts/" + fileObj.episode_num  + ".html"
  link.textContent = fileObj.episode_num + " - " + fileObj.title
  episode.appendChild(link)
  transcriptsUl.appendChild(episode)
}

async function fetchIndex() {
  const response = await fetch(baseURL + 'index.json');
  const indexJson = await response.json();
  return lunr.Index.load(indexJson);
}

async function search(query) {
  const idx = await fetchIndex();
  const results = idx.search(query);
  const ids = results.map(result => result.ref)
  removeAllChildNodes(transcriptsUl)
  ids.forEach(makeEpisode)
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


searchBox.addEventListener('input', async (event) => {
    const query = event.target.value;

    if (query.length > 2) {
        await search(query);
    }
});



populateList().then(() => console.log("list updated")).catch((e)=>console.log("Something went wrong"))
