#  is the first major backend I'll be working on 

I will share my thought process over here.

1. First I'll create all the files and follders that are needed to initialise a production level backend.

2. Installed nodemon to solve the restarting the server after every change problem.

  # Instead of this:
    node app.js

  # Use this:
    nodemon app.js

  changing the starting command to a custom script.

3. creating dotenv file and a gitignore file along with gitkeep file to commit empty files into the git