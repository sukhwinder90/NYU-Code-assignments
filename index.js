var parser = require('fast-xml-parser');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var he = require('he');
var path = require('path');
var fs = require('fs');

//Read the xml file named sample.xml
let xmlData = fs.readFileSync(path.join('sample.xml'), {encoding:'utf-8',flag:'r'});

//Function to create csv and write JSON records to CSV
 function write2CSV(records){

    //Initiating empty array to store all keys of JSON
    let allKeys = [];
    //Looping through records array and fetching each element of array
    records.forEach(element => {
        //Each element of the above array is JSON object and hence fetching keys and pushing to allKeys
        Object.keys(element).forEach(el => allKeys.push(el))
    });
    //Removing duplicate keys
    let keys = [...new Set(allKeys)];
    
    // console.log(keys)
    //Creating blank headers array as header for CSV
    let headers = [];
    //Loop through all keys and create headers
    for(let j = 0; j<keys.length; j++){
       headers.push({id:keys[j], title:keys[j]}) 
    }

    // console.log(headers)
    //It will create a csv file named planes.csv with headers in headers array
    const csvWriter = createCsvWriter({
        path: path.join('planes.csv'),
        header: headers
    });

    //Write the records in csv
    csvWriter.writeRecords(records)
    .then(() => {
        console.log("CSV Written as "+path.join("planes.csv"))
    })
    .catch(err => console.log(err))
}

//Validating sample.xml file
if (parser.validate(xmlData)===true){
    //Converting xmlData to JSON
    var jsonObj = parser.parse(xmlData);
    var planes = JSON.stringify(jsonObj.planes.plane);
    // console.log(planes);
    fs.writeFileSync(path.join('plane.json'), planes);
    console.log("JSON File is created as "+path.join("plane.json"))
    write2CSV(jsonObj.planes.plane)
}
