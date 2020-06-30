const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next) {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' })
  }

  return next()
}

const repositories = [];

app.use('/repositories/:id' ,validateId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body;

  const repositorie = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const repositorie = { id, url, title, techs, likes: repositories[repositoryIndex].likes}
  
  repositories[repositoryIndex] = repositorie

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoryIndex < 0) {
    return reponse.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  const currentRepository = repositories[repositoryIndex]
  const newRepositorie = {...currentRepository, likes: currentRepository.likes + 1}

  repositories.splice(repositoryIndex, 1, newRepositorie)

  return response.json(newRepositorie)
});

module.exports = app;
