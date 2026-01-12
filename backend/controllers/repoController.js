
const mongoose = require("mongoose");
const Repository  = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


const createRepository = async (req, res) => {
    const { owner, name, issues, content, description, visibility } = req.body;

    try {
        // 1. Validation: Repository name is required
        if (!name) {
            return res.status(400).json({ error: "Repository name is required!" });
        }

        // 2. Validation: Check if owner ID is a valid Mongoose ObjectId
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid User ID!" });
        }

        // 3. Create new Repository instance
        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,       // use owner from req.body
            content,
            issues       // if you want to save initial issues
        });

        // 4. Save to database
        const result = await newRepository.save();

        // 5. Success response
        res.status(201).json({
            message: "Repository created!",
            repositoryID: result._id,
        });

    } catch (err) {
        // 6. Error handling
        console.error("Error during repository creation:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};



async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find({})
            .populate("owner", "username email")  // only selected fields
            .populate("issues", "title status"); // only selected fields

        res.status(200).json(repositories);
    } catch (err) {
        console.error("Error during fetching repositories:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}





async function fetchRepositoryById(req, res) {
    const repoID = req.params.id; // get the id from route params

    try {
        const repository = await Repository.findById(repoID)
            .populate("owner", "username email")  // optional: only selected fields
            .populate("issues", "title status"); // optional: only selected fields

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.status(200).json(repository);
    } catch (err) {
        console.error("Error during fetching repository:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}










const fetchRepositoryByName = async (req, res) => {
    const repoName = req.params.name; // get name from route

    try {
        const repository = await Repository.findOne({ name: repoName })
            .populate("owner", "username email")
            .populate("issues", "title status");

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.status(200).json(repository);
    } catch (err) {
        console.error("Error during fetching repository:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};









async function fetchRepositoryForCurrentUser(req, res) {
  const userId = req.user; // req.user should be set by your auth middleware

  try {
    const repositories = await Repository.find({ owner: userId })
      .populate("owner", "username email")
      .populate("issues", "title status");

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ error: "No repositories found for this user" });
    }

    res.status(200).json({
      message: "Repositories found!",
      repositories,
    });
  } catch (err) {
    console.error("Error during fetching user repositories:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}








async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Update content
    if (content) {
      // If content is an array, append all items
      if (Array.isArray(content)) {
        repository.content = repository.content.concat(content);
      } else {
        repository.content.push(content);
      }
    }

    // Update description if provided
    if (description) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    res.status(200).json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}






// Toggle visibility of a repository (public/private)
const toggleVisiblityById = async (req, res) => {
  const { id } = req.params; // repository ID from route

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Toggle visibility
    repository.visibility = repository.visibility === "public" ? "private" : "public";

    const updatedRepository = await repository.save();

    res.status(200).json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};















async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}



module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisiblityById,
  deleteRepositoryById,
};
