

//= =======================================
// Login Route
//= =======================================
const mongoose = require('mongoose');
const DataSourceSchema = require('./../models/dataSourceModel').DataSourceSchema
const HistorySchema = require('./../models/historyModel').HistorySchema
const path = require('path')
const fs = require('fs')
const firstLine = require('firstline')
const csv = require('csv-parser');
const busboy = require('connect-busboy');
const batchNumber = require("./../config").batchNumber
//const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

DataSourceSchema.plugin(aggregatePaginate)
const History = mongoose.model('History', HistorySchema);



exports.uploadFile = async function (req, res, next) {
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', async (fieldname, file, filename) => {
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
        fstream.on('close', async () => {
            console.log(`Upload of '${filename}' finished`);

            let firstRow = await firstLine(uploadFilePath)
            let headers = firstRow.split(",")
            let period = headers[4]
            period = period.replace("Viewing=","")
            period = period.replace("[","")
            period = period.replace("]","")
            period = period.replace(/ /g,"")
            period = period.replace(/\//g, "_")
            let collectionName = "datasource@"+period
            let collinfo = await mongoose.connection.db.listCollections({name: collectionName}).toArray()
            if(collinfo.length === 0){
                var DataSource = mongoose.model(collectionName, DataSourceSchema)
                fs.createReadStream(uploadFilePath)
                .pipe(csv({headers:false, skipLines:2}))
                .on('data', async (row) => {
                    let rankNum = 0;
                    if(isNaN(row[2]) == false){
                        rankNum = Number(row[2].trim())
                    }
                    let data = {
                        searchTerm: row[1],
                        rank: rankNum,
                        asin1: row[3],
                        title1: row[4],
                        share1: convertNum(row[5]),
                        conv1: convertNum(row[6]),
                        asin2: row[7],
                        title2: row[8],
                        share2: convertNum(row[9]),
                        conv2: convertNum(row[10]),
                        asin3: row[11],
                        title3: row[12],
                        share3: convertNum(row[13]),
                        conv3: convertNum(row[14]),
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
                    if(DataSource && batchCount > 0){
                        DataSource.insertMany(modelList).then(()=>{
                            console.log('Added '+batchCount + ' records...')
                            modelList = null
                        })
            
                    }
                    let history = new History({recordNumber: totalCount, collectionName:collectionName})
                    history.save();
    
                    // remove file after insert data
    
                      console.log('CSV file successfully processed');
                });
    

            }

        }).on('finish', ()=>{
            try {
                fs.unlinkSync(uploadFilePath)
                //file removed
              } catch(err) {
                console.error(err)
              }                
            res.sendStatus(200);

        });




    });

};

exports.getData = async function (req, res, next) {
    console.log('connecting...');

    // getting search queries
    const {searchTerm, contextDate, page = 1, per_page = 10, sort="created_at|asc", targets, trends, filters} = req.query;
    if(typeof contextDate === "undefined" || typeof page  === "undefined" || typeof per_page === "undefined" || typeof sort === "undefined" || typeof targets=== "undefined"  || typeof trends === "undefined" || typeof filters === "undefined"){
        res.end();
        return
    }

    // console.log('searchTerm',searchTerm)
    // console.log('contextDate',contextDate)
    var targetsJson = JSON.parse(targets)
    var trendsJson = JSON.parse(trends)
    var filtersJson = JSON.parse(filters)

    let contextArr = contextDate.split("-")
    let contextDateObj = new Date(Number(contextArr[0]), Number(contextArr[1])-1, Number(contextArr[2]))

    //get all collections which contains 'datasource@'
    let collections = await mongoose.connection.db.listCollections({name: {$regex:  "datasource@", $options: 'i'}}).toArray()

    for(let i = 0; i < collections.length; i ++){
        let collection = collections[i];
        let colName = collection.name
        colName = colName.replace("datasource@", "")
        let colArr = colName.split("-")
        let startDateArr = colArr[0].split("_")
        let endDateArr = colArr[1].split("_")

        let startDate = new Date(Number("20"+startDateArr[2]), Number(startDateArr[0])-1, Number(startDateArr[1]))
        let endDate = new Date(Number("20"+endDateArr[2]), Number(endDateArr[0])-1, Number(endDateArr[1]))


        if(startDate <= contextDateObj && endDate >= contextDateObj){
            const DataSource = await mongoose.model(collection.name, DataSourceSchema);

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
                
                var searchMatcher = null;

                // making matches for exact matches 
                if(searchTerm.indexOf('-"') !== -1){
                    let pos = searchTerm.indexOf('-"');
                    let lastPos = searchTerm.indexOf('"', pos + 2)
                    if(lastPos != -1){
                        let exactStr = searchTerm.substring(pos+1, lastPos);
                        exactStr = exactStr.trim()
                        console.log("exact exclude",exactStr)
                        searchMatcher = {$regex: new RegExp("^((?!.*"+exactStr+".*).)*$")}
                    }else{
                        searchMatcher = {$regex:  searchTerm, $options: 'i'}
                    }
                }else if(searchTerm.indexOf("- ") !== -1){
                    let pos = searchTerm.indexOf("- ")
                    let lastPos = searchTerm.indexOf(" ", pos+3)
                    if(lastPos != -1){
                        let exactStr = searchTerm.substring(pos+2, lastPos);
                        exactStr = exactStr.trim()
                        searchMatcher = {$regex: new RegExp("^((?!.*"+exactStr+".*).)*$")}
                        
                        console.log("exclude that word",exactStr)
                    }else{
                        let exactStr = searchTerm.substring(pos+1);
                        exactStr = exactStr.trim()
                        searchMatcher = {$regex: new RegExp("^((?!.*"+exactStr+".*).)*$")}
                        console.log("exclude that word",exactStr)
                    }
                }else if(searchTerm.indexOf('"') !== -1){
                    let pos = searchTerm.indexOf('"')
                    let lastPos= searchTerm.indexOf('"', pos + 1)
                    if(lastPos !== -1){
                        let exactStr = searchTerm.substring(pos+1, lastPos);
                        exactStr = exactStr.trim()
                        console.log("exact include",exactStr)
                        searchMatcher = {$regex: exactStr}
                    }else{
                        searchMatcher = {$regex:  searchTerm, $options: 'i'}
                    }
                }else{
                    searchMatcher = {$regex:  searchTerm, $options: 'i'}
                }

                let matchFields = null;

                if(Number(targetsJson.searchTermChecked) == 0 && Number(targetsJson.asinChecked) == 1){
                    matchFields = {asin1: searchMatcher}
                }else{
                    matchFields = {searchTerm: searchMatcher}
                }



                var myAggreate = [
                    { $match: matchFields }
                 ]

                var totalFlag = false;
                // making aggreate for targets
                if(Number(targetsJson.allTitleChecked) == 1 ){
                    let avgAllShareComp = null;
                    let convAllShareComp = null;
                    if(Number(targetsJson.allClickSelect) == 0){
                        avgAllShareComp = { $gte: Number(targetsJson.allClickNumber) }
                    }else{
                        avgAllShareComp = { $lte: Number(targetsJson.allClickNumber) }
                    }
    
                    if(Number(targetsJson.allConvSelect) == 0){
                        convAllShareComp = { $gte: Number(targetsJson.allConvNumber) }
                    }else{
                        convAllShareComp = { $lte: Number(targetsJson.allConvNumber) }
                    }
                    myAggreate.push({ $addFields: { 
                        avgShare: { $sum:["$share1", "$share2", "$share3"]} ,
                        avgConv: { $sum:["$conv1", "$conv2", "$conv3"]} 
                    }})
                    myAggreate.push(
                        {
                            $match: { avgShare: avgAllShareComp ,avgConv: convAllShareComp},
                        }
                    )
                    totalFlag = true
                }

                if(Number(targetsJson.titleChecked) == 1){
                    let avgShareComp = null;
                    let convShareComp = null;
                    console.log("Number(targetsJson.clickNumber)",parseFloat(targetsJson.clickNumber))
                    if(Number(targetsJson.clickSelect) == 0){
                        avgShareComp = { $gte: Number(targetsJson.clickNumber) }
                    }else{
                        avgShareComp = { $lte: Number(targetsJson.clickNumber) }
                    }
    
                    if(Number(targetsJson.convSelect) == 0){
                        convShareComp = { $gte: Number(targetsJson.convNumber) }
                    }else{
                        convShareComp = { $lte: Number(targetsJson.convNumber) }
                    }

                    myAggreate.push({ $match: {share1: avgShareComp, conv1: convShareComp} })

                }

                //making aggreate for filters
                if(Number(filtersJson.rankChecked) == 1){
                    let filterMatch = { $match: { rank : { $gt: Number(filtersJson.rankNumber1) ,$lt: Number(filtersJson.rankNumber2)}}}
                    myAggreate.push(filterMatch)
                }

                if(Number(filtersJson.totalClickChecked) == 1){
                    if(totalFlag === false){
                        myAggreate.push({ $addFields: { 
                            avgShare: { $sum:["$share1", "$share2", "$share3"]} ,
                            avgConv: { $sum:["$conv1", "$conv2", "$conv3"]} 
                        }})
                        totalFlag = true;
                    }
                    let filterMatch = { $match: { avgShare : { $gt: Number(filtersJson.totalClickNumber1) ,$lt: Number(filtersJson.totalClickNumber2)} }}
                    myAggreate.push(filterMatch)
                }
                
                if(Number(filtersJson.totalConvChecked) == 1){
                    if(totalFlag === false){
                        myAggreate.push({ $addFields: { 
                            avgShare: { $sum:["$share1", "$share2", "$share3"]} ,
                            avgConv: { $sum:["$conv1", "$conv2", "$conv3"]} 
                        }})
                        totalFlag = true;
                    }
                    let filterMatch = { $match: { avgShare : { $gt: Number(filtersJson.totalConvNumber1) ,$lt: Number(filtersJson.totalConvNumber2)} }}
                    myAggreate.push(filterMatch)
                }
                

                if(Number(filtersJson.clickChecked) == 1){
                    let filterMatch = { $match: { share1 : { $gt: Number(filtersJson.clickNumber1) ,$lt: Number(filtersJson.clickNumber2)} }}
                    myAggreate.push(filterMatch)
                }
                
                if(Number(filtersJson.convChecked) == 1){
                    let filterMatch = { $match: { conv1 : { $gt: Number(filtersJson.convNumber1) ,$lt: Number(filtersJson.convNumber2)} }}
                    myAggreate.push(filterMatch)
                }

                let aggreate = DataSource.aggregate(myAggreate)
                console.log("myAggreate",myAggreate)

                await DataSource.aggregatePaginate(aggreate, options).then(result =>{
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
                res.end();    
            }
        }

    }
    res.end();    
};

// get missing dates for current year
exports.getMissingDates = async function (req, res, next) {
    console.log('connecting...');
    let collections = await mongoose.connection.db.listCollections({name: {$regex:  "datasource@", $options: 'i'}}).toArray()

    //get all Sundays for this year
    let allSundays = getSundays();

    let collectioNamesArray = []
    // making array of start dates from all collection names
    for(let i = 0; i < collections.length; i ++){
        let colName = collections[i].name
        colName = colName.replace("datasource@", "")
        let colArr = colName.split("-")
        let startDate = colArr[0]
        let startDateArr = startDate.split("_")
        let startTemp = startDateArr[0]+"_"+startDateArr[1]+"_20"+startDateArr[2];
        let dayStr = startDateArr[1]
        if(dayStr.length == 1){
            dayStr = "0"+dayStr; 
        }
        collectioNamesArray.push("20"+startDateArr[2]+"-"+startDateArr[0]+"-"+dayStr)
        let index = allSundays.indexOf(startTemp);
        if (index !== -1) {
            allSundays.splice(index, 1);
        }
    }
    collectioNamesArray.sort()
    console.log("collectioNamesArray",collectioNamesArray)


    // check missing start date using all Sundays
    let missinDateArray = []
    if(allSundays.length > 1){
        for(let i = 0; i < allSundays.length - 1; i++ ){
            let element = allSundays[i].split("_");
            let elementStart = new Date(Number(element[2]), Number(element[0])-1, Number(element[1]))
            let elementEnd = new Date(elementStart.getTime())
            elementEnd.setDate(elementStart.getDate()+6)
            missinDateArray.push(formatDate(elementStart)+" ~ " + formatDate(elementEnd))
        }
    }
    if(collectioNamesArray.length > 0){
        res.end(JSON.stringify({"missinDateArray":missinDateArray, "contextDate":collectioNamesArray[collectioNamesArray.length-1]}));
    }else{
        let today = new Date()
        let dateStr = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        
        res.end(JSON.stringify({"missinDateArray":missinDateArray, "contextDate":dateStr}));
    }

};


function convertNum(str){
    temp = str.replace("%","")
    temp = temp.trim()
    if(isNaN(temp) === false){
        return Number(temp)
    }else{
        return 0
    }
    
}
function formatDate(date) {
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getSundays() {
    Sundays = [];
    var today = new Date();
    var thisSunday = getSunday(new Date()).getTime()


    for(let i = 0; i <= today.getMonth(); i ++){
        var d = new Date();
        d.setMonth(i)
        d.setDate(0);
    
        // Get the first Sunday in the month
        while (d.getDay() !== 0) {
            d.setDate(d.getDate() + 1);
        }
    
        // Get all the other Sundays in the month
        while (d.getMonth() === i) {
            if(d.getTime() == thisSunday){
                break
            }
            let tempMonth = d.getMonth() + 1; 
            let tempDate = tempMonth +  "_" + d.getDate() + "_" + d.getFullYear();
            Sundays.push(tempDate);
            d.setDate(d.getDate() + 7);
        }
    
    }


    return Sundays;
}

function getSunday(dInput) {
    var d = new Date(dInput.getTime());
    d.setDate(d.getDate() - d.getDay());
    return d;
  }