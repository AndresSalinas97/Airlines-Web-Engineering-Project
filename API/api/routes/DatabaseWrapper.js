const MongoClient = require('mongodb').MongoClient;
var projectURL = "localhost:8080/";

class DatabaseWrapper {
	constructor() {
        this.uri = "mongodb+srv://admin:admin@cluster0-q0yt0.gcp.mongodb.net/test?retryWrites=true";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true });
        this.client.connect(err => {
            if(err != null)
            {
                console.log("ERRRRRRRRRORRRRRRRR WHILE CONNECTING:");
                console.log(err);
                return;
            }
        });


    }
    

    async getAirports(page_number=1, per_page=30){
        async function getAllAirportsFromMongo(collection)
        {
            var urlBegining =  "localhost:8080/airports/"
        
            var airports = await collection.distinct("airport");
        
            airports.forEach(airport => {
                airport.url = urlBegining + airport.code;
            });
        
            return airports;
        }
        
        var airports = await getAllAirportsFromMongo(this.client.db('web').collection('airlines'));

        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        let result = paginateOutput(projectURL + "airports", airports.slice(firstItem, lastItem), airports.length, page_number, per_page);

        return result;
    }

}

function paginateOutput(baseURL, dataArray, nItems, page_number, per_page)
{
    var result = {};

    result.page_number = page_number;

    result.per_page = per_page;

    result.total_count = nItems;

    result.total_pages = Math.ceil(result.total_count/result.per_page);

    result.last_page = baseURL + "?page=" + result.total_pages + "&per_page=" + result.per_page;

    if(result.page_number > 1)
    
        result.previous_page = baseURL + "?page=" + (page_number-1).toString() + "&per_page=" + result.per_page;

    if(result.page_number != result.total_pages)
        result.next_page = baseURL + "?page=" + (page_number+1).toString() + "&per_page=" + result.per_page;

    result.data = dataArray;

    return result;
}
module.exports.DatabaseWrapper = DatabaseWrapper