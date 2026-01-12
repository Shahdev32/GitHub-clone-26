const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  try {
    // Check if repo already exists
    try {
      await fs.access(repoPath);
      console.log("Repository already initialized.");
      return;
    } catch (_) {
      // Repo does not exist — continue
    }

    // Create .apnaGit and commits folder
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    // Create config file
    const config = {
      bucket: process.env.S3_BUCKET || null,
      createdAt: new Date().toISOString(),
    };

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log("Repository initialised successfully!");
  } catch (err) {
    console.error(" Failed to initialise repository");
    console.error(err.message);
  }
}

module.exports = { initRepo };
