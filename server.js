const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://**********:**********@cluster0.a6zzn.mongodb.net/Cluster0?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const absoluteIndex = __dirname + '/views/index.html';
const absoluteStyle = __dirname + '/public';

app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static(absoluteStyle));

let Schema = mongoose.Schema;


let UserInfo = new Schema({
    username: String,
    exercises: []
});

const UserInfoModel = mongoose.model("exerciseTracker", UserInfo);

// UserInfoModel.deleteMany({}, (err,data)=>{
//     if(err){
//         console.log("**********DELETEMANY_NOT_SUCCEED**********")
//     }
// })

app.get('/', (req,res)=>{
    res.sendFile(absoluteIndex, (err,data)=>{
        if(err){
            res.send("The first error")
            return 0;
        }
    })
})

https://MeaslyDimgrayFinance--five-nine.repl.co

app.listen(3000, ()=>console.log("~~~~~~~~~~Server is now running~~~~~~~~~~"))
