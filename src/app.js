const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');
const { response } = require("express");

const app = express();

function validateRepoId(req, res, next){
  const { id } = req.params;
  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid Repository ID"})
  }
  return next()
}


app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepoId)

const repositories = [];


app.get("/repositories", (request, response) => {
   return response.status(200).json(repositories)
});

app.post("/repositories",(request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if(repoIndex < 0){
    return response.status(400).json({ error: "Repo not found." })
  }
  const repository = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id)
  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository not Found'})
  }
  repositories.splice(repoIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id)
  if(repoIndex < 0){
    return response.status(400).json({error: "repository not found."})
  }

  
  const repository = repositories[repoIndex]
  repository.likes += 1;
  repositories[repoIndex] = repository
  
  
  return response.json(repository)
});

module.exports = app;
