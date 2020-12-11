

//= =======================================
// Login Route
//= =======================================
const mongoose = require('mongoose');
const DataSourceSchema = require('./../models/dataSourceModel').DataSourceSchema
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser');
const busboy = require('connect-busboy');
const DataSource = mongoose.model('DataSource', DataSourceSchema);
const batchNumber = require("./../config").batchNumber

exports.uploadFile = function (req, res, next) {
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
        var ext = path.extname(filename)    // getting extension of uploaded file
        var newFileName = new Date().getTime() + ""+ext;
        var appDir = path.join(path.dirname(require.main.filename), "uploads") ;    // store file in uploads directory temporarily
        var uploadFilePath = path.join(appDir, newFileName);
        console.log("realFileName",uploadFilePath)
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(uploadFilePath);   // create writestream
        // Pipe it trough
        file.pipe(fstream);
        

        // On finish of the upload
        var modelList = []
        var batchCount = 0
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            res.sendStatus(200);
            fs.createReadStream(uploadFilePath)
            .pipe(csv({headers:false,skipLines:2}))
            .on('data', (row) => {
                let data = {
                    searchTerm: row[1],
                    rank: row[2],
                    asin1: row[3],
                    title1: row[4],
                    share1: row[5],
                    conv1: row[6],
                    asin2: row[7],
                    title2: row[8],
                    share2: row[9],
                    conv2: row[10],
                    asin3: row[11],
                    title3: row[12],
                    share3: row[13],
                    conv3: row[14],
                }

                modelList.push(data)        // prepare for  bulk insert
                batchCount ++
                console.log("batchCount",batchCount)


                // if record number is over 500, bulk insert and then another 500 records
                if(batchCount > batchNumber){
                    let tempList = [...modelList]
                    DataSource.insertMany(tempList).then(function(){
                        console.log('Added '+tempList.length + ' records...')
                        tempList = null
                    })
                    batchCount = 0
                    modelList = []
                }

            })
            .on('end', () => {

                // insert the rest records in end
                if(batchCount > 0){
                    DataSource.insertMany(modelList).then(()=>{
                        console.log('Added '+batchCount + ' records...')
                        modelList = null
                    })
        
                }

                // remove file after insert data
                try {
                    fs.unlinkSync(uploadFilePath)
                    //file removed
                  } catch(err) {
                    console.error(err)
                  }                
              console.log('CSV file successfully processed');
            });
        });


    });

};

exports.getData = async function (req, res, next) {
    console.log('connecting...');
    const {page = 1, limit = 10} = req.query;
    try{
        const datasources = await DataSource.find().limit(limit * 1).skip((page - 1) * limit).exec()
        const count = await datasources.countDocuments();
        res.json({
            datasources,
            totalPages: Math.ceil(count / limit),
            currentPage: page
          });    
    
    }catch (err){
        console.log(err);
    }


};
