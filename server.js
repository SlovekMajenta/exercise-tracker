const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://zigotaTestova:qN12HlAtSTYce87V@cluster0.a6zzn.mongodb.net/Cluster0?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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

app.post('/api/exercise/new-user', (req,res)=>{
    const userName = req.body.username;
    UserInfoModel.findOne({username : userName}, function(err,data){
        if(err){
            res.send('The second error')
            return 0;
        }
        else if(data === null){
            const doc = new UserInfoModel({
                username : userName
            });
            doc.save((err,data)=>{
                if(err){
                    res.send("The third error")
                }
                res.json({
                    'username': data.username,
                    '_id': data._id
                })
            })
        }
        else{
            res.send('Username already taken')
        }   
    })
})


app.post('/api/exercise/add', (req,res)=>{
    let date;

    UserInfoModel.findById(req.body.userId, function(err,data){
        if(err){
            res.send('Cast to ObjectId failed for value "' + err.value + '" at path "' + err.path +'" for model "UserInfoModel"');
        }
        else if(data == null){
            res.send('Unknown userId');
            return 0;
        }
        else if(!req.body.description){
            res.send("Path 'description' is required")
        }
        else if(!req.body.duration){
            res.send("Path 'duration' is required")
        }
        else if(req.body.date){
            date = new Date(req.body.date);
        }
        else if(!req.body.date){
            date = new Date();
        }
        if(req.body.description.length > 20){
            res.send('description is too long');
            return 0;
        }
        else if(parseInt(req.body.duration) < 0){
            res.send('duration is too short');
            return 0;
        }

        let dateFormat = date.getDate() + '\/' + date.getUTCMonth() + "\/" + date.getFullYear()

        let obj = {
            description: req.body.description,
            duration: parseInt(req.body.duration),
            date: date
        }

        data.exercises.push(obj)

        data.save((err,data)=>{
            if(err){
                res.send("The fourth error")
            }
            res.json({
                '_id': data._id,
                'username': data.username,
                'date': dateFormat,
                'duration' : obj.duration,
                'description': obj.description
            })
        })
    })
})

app.get('/api/exercise/log', (req,res)=>{
    if(!req.query.userId){
        res.send("userId query parameter is needed")
        return 0;
    }
    let userId = req.query.userId;

    UserInfoModel.findById(userId, (err,data)=>{
        if(err){
            res.send(err)
        }

        let arr = [];

        if(req.query.from && req.query.to && req.query.limit){
            let from = new Date(req.query.from)
            let to = new Date(req.query.to)
            let lim = parseInt(req.query.limit)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date > from && data.exercises[i].date < to){
                    arr.push(data.exercises[i]);
                }
            }

            arr = arr.splice(0, lim);
        }
        else if(req.query.from && req.query.to){
            let from = new Date(req.query.from)
            let to = new Date(req.query.to)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date > from && data.exercises[i].date < to){
                    arr.push(data.exercises[i]);
                }
            }
        }
        else if(req.query.from && req.query.limit){
            let from = new Date(req.query.from)
            let lim = parseInt(req.query.limit)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date > from){
                    arr.push(data.exercises[i]);
                }
            }

            arr = arr.splice(0, lim);
        }
        else if(req.query.to && req.query.limit){
            let to = new Date(req.query.to)
            let lim = parseInt(req.query.limit)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date < to){
                    arr.push(data.exercises[i]);
                }
            }

            arr = arr.splice(0, lim);
        }
        else if(req.query.from){
            let from = new Date(req.query.from)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date > from){
                    arr.push(data.exercises[i]);
                }
            }
        }
        else if(req.query.to){
            let to = new Date(req.query.to)

            for (let i = 0; i < data.exercises.length; i++){
                if (data.exercises[i].date < to){
                    arr.push(data.exercises[i]);
                }
            }
        }
        else if(req.query.limit){
            let lim = parseInt(req.query.limit)

            for (let i = 0; i < lim && i < data.exercises.length; i++){
                arr.push(data.exercises[i]);
            }
        }
        else{
            arr = data.exercises;
        }

        res.json({
            '_id': data._id,
            'username': data.username,
            'count': arr.length,
            'log': arr
        })
        return 0;
    })
})

app.listen(3000, ()=>console.log("~~~~~~~~~~Server is now running~~~~~~~~~~"))