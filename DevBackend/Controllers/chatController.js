const Message = require("../models/Chat.js");
const User = require("../models/user.js");

const Project = require("../models/project.js");

const mongoose = require("mongoose");
var app = require("../app.js")


var http = require('http').Server(app);
var io = require('socket.io')(http);

exports.savemsg = async (req, res, next) => {
    console.log(req.body);
    try {
    
        var message = {
            name: req.body.name,
            message: req.body.message
        }
                
        var name2 = req.body.channel;
        //message ke badle signup ka module;
        var channels = await Message.find({ channelname: name2 }).exec();
        console.log(channels);
        if (channels.length == 0 ) {
            const chat = new Message({
                _id:new mongoose.Types.ObjectId(),
                channelname: req.body.channel,
                person:0,
                messages: [
                    {
                        name: req.body.name,
                        message: req.body.message
                    }
                ]
            })
            chat.save().then((result) => {
                console.log("Succes new chat");
            })
            
        }
        else {            
 
         Message.findOneAndUpdate(
            { channelname: req.body.channel },
            { $push: { messages: message } }, { upsert: true, new: true }
        ).exec();
}
        console.log("Hee");
        console.log(req.body.channel);

        // await message.updateOne({ channelname:'Java' }, { $push: { messages: { message } } },upsert=True);
        // await message.save()
    
        await io.in(req.body.channel).emit('message', message);
        console.log(io.connected);
        res.sendStatus(200);
    }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message send')
  }
}

exports.getmsg = async (req, res, next) => {
// console.log(JSON.parse(req.body) + "sgdgadg");
    var channel = req.body.channel;
    console.log(req.body)    
    await Message.find({ channelname: channel }, (err, messages) => {
        console.log(messages);
        console.log("hellooo")
        res.send(messages);
    })
}


exports.profile = async (req, res, next) => {
    var userid = req.body.userid;
    console.log(req.body);
    User.find({_id:userid}, (err, info) => {
        console.log(info);
        res.send(info);
    })
}

exports.getprojs = async (req, res, next) => {
    var projid = req.body.projid;
    console.log(req.body);
    Project.find({ _id: projid }, (err, info) => {
        console.log(info);
        res.send(info);
    })
}

// app.get('/messages', (req, res) => {
//   Message.find({ channelname: "Java" }, (err, messages) => {
//     console.log(messages);
//     res.send(messages);
//   })
// })

// exports.getmsg = (req, res, next) => {
//     console.log(req.body);
//     var user = req.params.user
//   Message.find({name: user },(err, messages)=> {
//     res.send(messages);
//   })
// }


// app.post('/messages', async (req, res) => {
//   try {
    
//     var message = {
//       name: req.body.name,
//       message:req.body.message
//     }
//     console.log(message,req.body);
//   //   await Message.updateOne(
//   // { channelname:"Java" }, 
//   // { $addToSet: { messages: message } }
//   //   );

//     Message.findOneAndUpdate(
//   { channelname: "Java" },
//       { $push: { messages: message } }, { upsert: true, new: true }
// ).exec();

//     console.log("Hee");
//     // await message.updateOne({ channelname:'Java' }, { $push: { messages: { message } } },upsert=True);
//     // await message.save()
//     var censored = await Message.findOne({message:'badword'});
//       if(censored)
//         await Message.remove({_id: censored.id})
//       else
//         io.in("Java").emit('message', req.body);
//       res.sendStatus(200);
//   }
//   catch (error){
//     res.sendStatus(500);
//     return console.log('error',error);
//   }
//   finally{
//     console.log('Message send')
//   }
// })
