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
Two extensions were added to the API that implement additional endpoints beside the ones required in the project description. Firstly, there is the option to see rankings of different carriers based on carrier-specific delay information in both minutes and number of delays. Secondly, comments with user scores can be added to each carrier, which are stored in a separate collection from the airlines data, and these can also be viewed. The exact requests and results that the endpoints offer can be found in the API documentation.

### Architectural overview
The API folder contains server, routes, database wrapper, utilities and manager files as well as the files needed for node projects and libraries. 

The routes part of the program handles the receiving of http requests, sending error messages when needed and calling a function to receive the response data from the carriers or airports manager and sending that otherwise. It also calls a json to csv converter function from the json2csv library to convert between the two formats when csv is specified in the content-type parameter in the header of a request. 

The carrier, ratings and airport manager receive requests and generate the results by using the functions in the database wrapper file, using the stats-lite library to calculate simple parameters from the data, and by generating links to related pages when necessary, sometimes by using the pagination.js file in utils. 

The database wrapper uses the mongodb driver's find, distinct and update functions to read and manipulate the data as needed. The data itself is stored in a mongodb Atlas cloud database. 

With these components, the server is able to receive requests, retrieve or modify the data needed for the request and show a corresponding result.

### Design principles
In designing the API, the principles of REST were to be taken into account. Below is an explanation of how each of the REST principles were incorporated into the final design of the API.

Resource identification: the data representations required for this project were incorporated such that there is a clear structure of resources, namely carriers and their statistics as well as airports and the delaystats resource which implements the endpoint that provides descriptive statistics. Each resource that contains a large amount of data is paginated, with links between pages provided in the results. 

Uniform interface: each resource can be retrieved using a GET request, and http parameters follow the same simple format across all requests. For example, the carrier parameter can be added to the request having a valid airport code as its value and will work the same way in all requests where filtering by parameter is possible. The statistics resources can be created, updated and deleted simply by changing the http verb and adding any new data to be added in the body of the request.

Self-describing messages: each resource has a content-type corresponding to the one specified in the request. The content-type is negotiable, as the data can be represented in json or csv. With the data included in the data part in the body and metadata added separately, the message stands on its own as a readable response without any other context.

HATEOAS: metadata in responses contains links to resources that might be needed next, and links to next, previous and last pages are always included whenever pagination is applied.

Stateless interactions: since there is no login system of sorts, the API does not currently need to keep track of client sessions of any sort. The client is able to perform requests without the need of any further context. Therefore, aside from the database there is no state to be tracked by the server.
