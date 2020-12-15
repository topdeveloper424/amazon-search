

//= =======================================
// Login Route
//= =======================================
const mongoose = require('mongoose');
const DataSourceSchema = require('./../models/dataSourceModel').DataSourceSchema
const HistorySchema = require('./../models/historyModel').HistorySchema
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser');
const busboy = require('connect-busboy');
const batchNumber = require("./../config").batchNumber
const mongoosePaginate = require('mongoose-paginate-v2');

DataSourceSchema.plugin(mongoosePaginate)
const DataSource = mongoose.model('DataSource', DataSourceSchema);
const History = mongoose.model('History', HistorySchema);

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
        var totalCount = 0
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
                totalCount ++
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
                let history = new History({recordNumber: totalCount})
                history.save();

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

    // getting search queries
    const {searchTerm, page = 1, per_page = 10, sort="created_at|asc"} = req.query;
    console.log('searchTerm',searchTerm)
    
    try{
        // sort field and mode
        let sortArr = sort.split("|")
        let sortField = sortArr[0]
        let sortMode = sortArr[1]

        // making options for filter
        let options = {}
        options['offset'] = page
        options['limit'] = per_page
        let sortItem = {}
        sortItem[sortField] = sortMode
        options['sort'] = sortItem

        DataSource.paginate({searchTerm: {$regex:  searchTerm, $options: 'i'} }, options).then(result =>{
            console.log(result.totalDocs)
            // making pagination for vuetable-2
            let pagination = {}
            pagination.per_page = result.limit
            pagination.total = result.totalDocs
            pagination.current_page = result.offset
            pagination.last_page = result.totalPages
            let nextPage = null;
            let to = result.totalDocs
            if(result.offset != result.totalPages){
                nextPage = result.offset + 1
                to = result.offset * result.limit
            }
            let prevPage = null;
            let from = 1;
            if(result.offset != 1){
                prevPage = result.offset - 1
                from = result.offset * result.limit + 1
            }
            result.data = result.docs
            pagination.from = from
            pagination.to = to
            result.docs = null

            pagination.next_page_url = "http://"+req.headers.host+"/data/getData?page="+nextPage
            pagination.prev_page_url = "http://"+req.headers.host+"/data/getData?page="+prevPage
            result.pagination =pagination 

            res.end(JSON.stringify(result));    
    
        })
    
    }catch (err){
        console.log(err);
    }


};
