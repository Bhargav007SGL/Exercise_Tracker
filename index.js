const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))

var allUserData = []; 
var allUserDataWithLogs = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  var uniqID = new Date().getTime();
  var userNameAndID = {"username":req.body.username,"_id":uniqID};
  res.send(userNameAndID);
  allUserData.push(userNameAndID);
});

app.get('/api/users', (req, res) => {
  if(allUserData.length == 0)
  {
    return res.send(`No Data`);
  }
  res.send(allUserData)
});

app.post('/api/users/:_id/exercises',(req,res)=>
{
  var isFlag = false;
  var count = 1;
  var objectDate = new Date(req.body.date);
  var duration = req.body.duration;
  var description = req.body.description;
  var id = req.body[":_id"];
  var log = [];
  var username = "";
  allUserData.map((value)=>
  {
    if(id == value["_id"])
    {
      username = value.username;
    }
  })
  if(username == "")
  {
    return res.send(`Invalid ID`);
  }
  if(objectDate == `Invalid Date`)
  {
    objectDate = new Date().toDateString();
  }
  allUserDataWithLogs.map((value,index)=>
  {
    if(value.count && id == value["_id"])
    {
      isFlag = true;
      count = value.count;
      ++count;
      var dummyLog = value.log;
      dummyLog.push({"description":description,"duration":parseInt(duration),"date":objectDate})
      log = dummyLog;
      allUserDataWithLogs[index].count = count;
      allUserDataWithLogs[index].log = log;
    } 
  })
  if(!isFlag)
  {
    log.push({"description":description,"duration":parseInt(duration),"date":objectDate})
    allUserDataWithLogs.push({"_id":id,"count":count,"log":log})
  }
  res.send({"_id":id,"username":username,"date":objectDate,"duration":parseInt(duration),"description":description})
})

app.get('/api/users/:_id/logs',(req,res)=>
{
  var id = req.params["_id"];
  var username = "";
  allUserData.map((value)=>
  {
    if(id == value["_id"])
    {
      username = value.username;
    }
  })
  if(username == "")
  {
    return res.send(`Invalid ID`);
  } 
  var count = 0;
  var log = [];
  allUserDataWithLogs.map((value,index)=>
  {
    if(value["_id"] == id)
    {
      count = allUserDataWithLogs[index].count;
      log = allUserDataWithLogs[index].log;
    }
  })
  res.send({"_id":id,"username":username,"count":count,"log":log})
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
