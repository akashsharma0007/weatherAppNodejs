const http = require('http');
const fs = require('fs');
const requests = require('requests'); //This not an in built package

const homeFile =  fs.readFileSync("home.html","utf-8");

//ReplaceVal receive two arguments with intention of replacing home.html data with api data.  
const replaceVal = (tempVal,orgVal) => {
        let temperature = tempVal.replace("{%tempcur%}",orgVal.main.temp);
        temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
        temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
        temperature = temperature.replace("{%city%}",orgVal.name);
        temperature = temperature.replace("{%country%}",orgVal.sys.country);
        return temperature;
};
const server = http.createServer((req,res)=>{
    if (req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=43.4668&lon=-80.5164&appid=b2da5987fd81d12f04d2959330d2e755")

        //Below data and end are in built functions
        .on('data',  (chunk)=> {
          const objData = JSON.parse(chunk); //Here the "chunk" is converted JSON into Object
          const arrayData = [objData]; //Here  objData is converted Array of object.
        
          //   console.log(arrayData[0].main.temp);
        
         //Below Value(API values) holds the entire values 

        //  Here we used join to convert this code in string
        //1. homeFile has all the data from home.html 2. "value" holds the data read from api
        //3. Then we called replaceVal function. 
        const realtimeData = arrayData.map((value)=>  replaceVal(homeFile,value)).join(" ");
            res.write(realtimeData);
            // console.log(realtimeData);
    })          

        .on('end',  (err)=> {
          if (err) return console.log('connection closed due to errors', err);
         res.end();
        });

    }
   
});


server.listen(8000,"127.0.0.1"); 

