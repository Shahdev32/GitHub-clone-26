const express = require("express");

const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server } = require("socket.io");
const mainRouter = require("./routes/main.router")



dotenv.config();


  const app = express();
 app.use(express.json());       // for JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());





const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))

     .command("start", "starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)

  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv)=>{
        addRepo(argv.file);
    }
  )

  .command(
    "commit <message>",
    "Commit staged changes",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv)=>{
        commitRepo(argv.message);
    }
  )

  .command("push", "Push changes to remote repository", {}, pushRepo)

  .command("pull", "Pull changes from remote repository", {}, pullRepo)

  .command(
    "revert <commitId>",
    "Revert a commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit ID to revert",
        type: "string",
      });
    },
    revertRepo
  )

  .demandCommand(1, "You need at least one command")
  .help()
  .argv;


  function startServer(){
    console.log("server logic called");
  }





  const port = process.env.PORT || 3000;


  


  const mongoURI = process.env.MONGODB_URI;

  mongoose.connect(mongoURI).then(()=>{
    console.log("MongoDB connected")
  })
  .catch((err)=>{
    console.log("unable to connect:",err);


  });

  app.use(cors({ origin:"*"}));

 
  app.use("/",mainRouter);



  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer,{

  
  cors:{
    origin:"*",
    methods:["GET","POST"],

  },
  });

  io.on("connection",(socket)=>{
    socket.on("joinRoom",(userID)=>{
      user=userID;
      console.log("=======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    });
  });


  const db = mongoose.connection;

















  db.once("open",async()=>{
    console.log("CRUD operation called!")
    //  crud operation
  })

  httpServer.listen(port,()=>{
    console.log(`server is running on PORT ${port}`);
  })

  
















