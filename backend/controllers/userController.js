const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");




dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).send("Server error");
  }
};








const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id });

  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error");
  }
};








async function getAllUsers(req, res) {
  try {
    await connectClient();

    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray(); 

    res.json(users);

  } catch (err) {
    console.log("Error during fetching", err.message);
    res.status(500).send("Server Error");
  }
}






var   ObjectId  = require("mongodb").ObjectId;

async function getUserProfile(req, res) {
  const currentID = req.params.id;
  console.log("Requested ID:", currentID); // log the incoming ID

  if (!currentID) {
    console.error("No ID provided in request params!");
    return res.status(400).send("No ID provided");
  }

  try {
    await connectClient(); // make sure your client connects successfully
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let user;

    try {
      // Attempt to convert string to ObjectId
      user = await usersCollection.findOne({ _id: new ObjectId(currentID) });
    } catch (err) {
      // If ObjectId conversion fails
      console.error("Invalid ObjectId format:", err.message);
      return res.status(400).send("Invalid ID format");
    }

    console.log("User Found:", user); // log the user result

    if (!user) {
      console.warn("User not found for ID:", currentID);
      return res.status(404).send("User not found");
    }

    const { password, ...userWithoutPassword } = user; // hide password
    res.json(userWithoutPassword);

  } catch (err) {
    console.error("Error during fetching user:", err.message);
    res.status(500).send("Server Error");
  }
}









 








async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10); // FIX: genSalt, not getSalt
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentID) }, // filter
      { $set: updateFields },           // update
      { returnDocument: "after" }       // options: return updated doc
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: pwd, ...userWithoutPassword } = result.value;
    res.json(userWithoutPassword);

  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server Error");
  }
}









async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(currentID) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Error deleting profile:", err.message);
    res.status(500).send("Server Error");
  }
}


module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
