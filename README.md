# Web-Engineering-Project
Final project for Web Engineering course

### Documentation
The documentation for the API can be found in the documentation folder. This file serves as our project report.

### Running the code
The API folder contains our node API. To use node to run it, install npm and node on your computer, then run 
`npm install` 
inside the API folder, followed by 
`node server.js` 
. After this, the server will wait for requests on localhost:8080.

### Choice of technologies
We picked the node framework combined with express and a mongodb database, because two of us had worked with them before. In this particular project, we had to work with json which is easy to do with each of these. There are also many node libraries that can easily be added using npm.

### Extensions
No extensions to the API have been implemented yet. We intend to implement some extensions before the final deadline.

### Architectural overview
The API folder contains routes, database wrapper and carriers and airports manager files. 

The routes part of the program handles the receiving of http requests, sending error messages when needed and calling a function to receive the response data from the carriers or airports manager and sending that otherwise. It also calls a json to csv converter function from the json2csv library to convert between the two formats when csv is specified in the content-type parameter in the header of a request. 

The carrier and airport manager receive requests and generate the results by using the functions in the database wrapper file, using the stats-lite library to calculate simple parameters from the data, and by generating links to related pages when necessary. 

The database wrapper uses the mongodb driver's find, distinct and update functions to read and manipulate the data as needed. The data itself is stored in a mongodb Atlas cloud database. 

With these components, the server is able to receive requests, retrieve or modify the data needed for the request and show a corresponding result.
