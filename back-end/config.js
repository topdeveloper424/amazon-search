module.exports  = {
    // Remote monogodb url
//    mongoURL: "mongodb+srv://Serverusr1:<password>@cluster0.gbgc3.azure.mongodb.net/<dbname>?retryWrites=true&w=majority",
    mongoURL: 'mongodb://localhost:27017/amazon_db',
 
    // Request limit number
    batchNumber: 500,

    // Maximum request number for signup
    requestMaxSignupNum: 3
};