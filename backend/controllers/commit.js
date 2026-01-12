const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(argv) {
  const message = argv.message;

  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // Check if repository exists
    try {
      await fs.access(repoPath);
    } catch {
      console.error(" Not an apnaGit repository. Run `init` first.");
      return;
    }

    // Check if staging area exists
    try {
      await fs.access(stagingPath);
    } catch {
      console.error(" Nothing to commit (staging area is empty).");
      return;
    }

    const files = await fs.readdir(stagingPath);
    if (files.length === 0) {
      console.error(" Nothing to commit (no staged files).");
      return;
    }

    // Create commit directory
    const commitID = uuidv4();
    const commitDir = path.join(commitsPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    // Copy staged files into commit directory
    for (const file of files) {
      const src = path.join(stagingPath, file);
      const dest = path.join(commitDir, file);
      await fs.copyFile(src, dest);
    }

    // Save commit metadata
    const commitMeta = {
      id: commitID,
      message,
      timestamp: new Date().toISOString(),
      files,
    };

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(commitMeta, null, 2)
    );

    // Clear staging area
    for (const file of files) {
      await fs.unlink(path.join(stagingPath, file));
    }

    console.log(`Commit successful!`);
    console.log(`Commit ID: ${commitID}`);
  } catch (err) {
    console.error(" Error committing changes:");
    console.error(err.message);
  }
}

module.exports = { commitRepo };
