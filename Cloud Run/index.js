const express = require('express');
const {readFileSync} = require('fs');

var path = require('path');
//var Chart = require('chart.js');

// const handlebars = require('handlebars');
const Firestore = require('@google-cloud/firestore');

const app = express();
// Serve the files in /assets at the URI /assets.
app.use('/assets', express.static('assets'));

app.set('view engine', 'ejs');

// The HTML content is produced by rendering a handlebars template.
// The template values are stored in global state for reuse.
const data = {
  service: process.env.K_SERVICE || '???',
  revision: process.env.K_REVISION || '???',
};
let template;

const db = new Firestore({
    projectId: 'Your Project-ID Here',
    keyFilename: 'Your Database KeyFilePath',
  });

var receivedData={};

// function getData(){
// const snapshot = db.collection('GeckoData').get();
// receivedData=snapshot;
// snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
// });
// }

app.get('/all', async (req, res) => {
    // console.log('tjollahopp')
    var currentTemp;
    var currentTempOutside;
    var jsondude = [];
    await db.collection('GeckoData').get()
        .then(response => {
            console.log(response)
            //let jsondude = JSON.stringify(response)
                response.forEach((item)=> {
                    currentTemp=item.data().temperature
                    currentTempOutside=item.data().temperatureOutside
                    jsondude.push(item.data());
                })
                jsondude = JSON.stringify(jsondude)
                res.render('index',{currentTemp:currentTemp,jsondude:jsondude,currentTempOutside:currentTempOutside});
            })
            .catch(error => {
                console.log(error);
            });
});

// app.get('/all', async (req, res) => {
//     console.log('tjollahopp')
//     var array1 = [];
//     var jsondude = [];
//     await db.collection('GeckoData').get()
//         .then(response => {
//             console.log(response)
//             //let jsondude = JSON.stringify(response)
//                 response.forEach((item)=> {
//                     array1.push(item.data());
//                     jsondude.push(item.data());
//                 })
//                 console.log(array1)
//                 jsondude = JSON.stringify(jsondude)
//                 res.render('index',{items:array1,jsondude:jsondude});
//                 //res.send(array1);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
// });


app.get('/latest', async (req, res) => {
    var array2 = [];
    await db.collection('GeckoData').orderBy('time','desc').limit(1).get()
        .then(response => {
                response.forEach((item)=> {
                    array2.push(item.data());
                })
                res.send(array2);
            })
            .catch(error => {
                console.log(error);
            });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});