const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

// Create repository
repoRouter.post("/repo/create", repoController.createRepository);

// Get all repositories
repoRouter.get("/repo/all", repoController.getAllRepositories);

// Get repository by ID
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);

// Get repository by name
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);

// Get repositories of current user
repoRouter.get("/repo/:userID", repoController.fetchRepositoryForCurrentUser);

// Update repository by ID
repoRouter.put("/repo/:id", repoController.updateRepositoryById);

// Toggle visibility
repoRouter.patch("/repo/visibility/:id", repoController.toggleVisiblityById);

// Delete repository
repoRouter.delete("/repo/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;
