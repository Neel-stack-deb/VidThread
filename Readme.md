#  is the first major backend I'll be working on 

I will share my thought process over here.

1. First I'll create all the files and follders that are needed to initialise a production level backend.

2. Installed nodemon to solve the restarting the server after every change problem.

  # Instead of this:
    node app.js

  # Use this:
    nodemon app.js

  changing the starting command to a custom script.

3. creating dotenv file and a gitignore file along with gitkeep file to commit empty files into the git.

4. Connecting the MongoDB Atlas with aws server and gracefully handle its async nature with proper try catch handelling.

5. calling the ConnectionToDB function and gracefully handle error. using then() handled what to do next by first starting the server and also making proper error handling codes for server related issues with server.on('error') and then SIGINT and SIGTERM OS signals by gracefully exiting the process by first stopping the server and disconnecting the database connection.

6. We should create multiple utility files which will have bundlers and standarized error handling as well as standardized API response code.

7. added error handling middleware
