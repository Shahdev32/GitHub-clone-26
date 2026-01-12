const fs = require("fs").promises;
const path = require("path");

async function revertRepo(argv) {
  const commitId = argv.commitId;

  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitId);

    // Check if commit exists
    try {
      await fs.access(commitDir);
    } catch {
      console.error(" Commit not found");
      return;
    }

    const files = await fs.readdir(commitDir);

    // Restore files to working directory
    for (const file of files) {
      if (file === "commit.json") continue;

      const src = path.join(commitDir, file);
      const dest = path.join(process.cwd(), file);

      await fs.copyFile(src, dest);
    }

    console.log(`Reverted to commit ${commitId}`);
  } catch (err) {
    console.error(" Revert failed:");
    console.error(err.message);
  }
}

module.exports = { revertRepo };
