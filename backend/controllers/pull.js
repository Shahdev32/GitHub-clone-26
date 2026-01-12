async function pullRepo() {
  console.log(" Pull started...");
  console.log(" Checking for new commits on remote...");

  // Dummy delay
  await new Promise((res) => setTimeout(res, 500));

  console.log(" Repository is already up to date (dummy)");
}

module.exports = { pullRepo };
