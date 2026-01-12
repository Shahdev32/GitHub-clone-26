const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

// Create a new issue
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params; // repository ID

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    // Check if repository exists
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // Create the issue
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// Update an issue by ID
const updateIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue updated successfully", issue: updatedIssue });
  } catch (err) {
    console.error("Error updating issue:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an issue by ID
const deleteIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully", issue: deletedIssue });
  } catch (err) {
    console.error("Error deleting issue:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all issues
const getAllIssue = async (req, res) => {
  try {
    const issues = await Issue.find().populate("repository", "name description");
    res.json(issues);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single issue by ID
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate("repository", "name description");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssue,
  getIssueById,
};
