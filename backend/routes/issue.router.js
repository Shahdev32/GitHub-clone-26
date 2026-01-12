const express = require("express");
const issueController = require("../controllers/issueController");

const issueRouter = express.Router();

// Create issue
issueRouter.post("/issue/create", issueController.createIssue);

// Get all issues for a repo
issueRouter.get("/issue/all", issueController.getAllIssue);

// Get single issue
issueRouter.get("/issue/:id", issueController.getIssueById);

// Update issue
issueRouter.put("/issue/update/:id", issueController.updateIssueById);

// Delete issue
issueRouter.delete("/issue/:id", issueController.deleteIssueById);

module.exports = issueRouter;
