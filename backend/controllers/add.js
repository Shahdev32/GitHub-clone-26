const fs = require("fs").promises;
const path = require("path");

async function addRepo(argv) {
  const filePath = argv.file; // yargs passes arguments as an object

  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    // Check if repository exists
    try {
      await fs.access(repoPath);
    } catch {
      console.error(" Not a apnaGit repository. Run `init` first.");
      return;
    }

    // Check if file exists
    const absoluteFilePath = path.resolve(process.cwd(), filePath);
    await fs.access(absoluteFilePath);

    // Create staging directory
    await fs.mkdir(stagingPath, { recursive: true });

    // Copy file to staging area
    const fileName = path.basename(filePath);
    const destination = path.join(stagingPath, fileName);

    await fs.copyFile(absoluteFilePath, destination);

    console.log(`File "${fileName}" added to the staging area`);
  } catch (err) {
    console.error(" Error adding file:");
    console.error(err.message);
  }
}

module.exports = { addRepo };
