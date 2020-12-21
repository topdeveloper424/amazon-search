module.exports  = {
    // Remote monogodb url
//    mongoURL: "mongodb+srv://Serverusr1:J6ZqMqrjJGVSQGqq@cluster0.gbgc3.azure.mongodb.net/amazon_db?retryWrites=true&w=majority",
    mongoURL: 'mongodb://localhost:27017/amazon_db',
 
    // Request limit number
    batchNumber: 500,

    // Maximum request number for signup
    requestMaxSignupNum: 3
};