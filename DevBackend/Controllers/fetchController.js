const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
var stringSimilarity = require("string-similarity");
const Project = require("../models/project.js");


exports.fetchUsers = async (req, res) => {    
    cookies = req.headers.authorization.slice(7,)
    // console.log(cookies)
    cook = cookies.split("; ");
    const substring = "authtoken=";
    const x = cook.find((element) => {
        if (element.includes(substring)) {
            return element;
        }
    });
    var dec;
    if (x) {
        dec = jwt.decode(x.slice(10));
    }

    // console.log(dec.userId)
    data = await User.findOne({ _id: mongoose.Types.ObjectId(dec["userId"])}, 'name bio gitlink techstack').exec()
    
    // inpArr = (JSON.parse(JSON.stringify(data)).techstack)
    arrays = await User.find({ _id: { $ne: mongoose.Types.ObjectId(dec["userId"]) } }, 'name bio gitlink').exec()

    console.log(arrays)
    bios = []
    ids = []
    names = []
    techstacks = []

    for(i = 0; i<arrays.length; i++){
        bios.push(arrays[i].bio)
        ids.push(arrays[i]._id)
        names.push(arrays[i].name)
        techstacks.push(JSON.parse(JSON.stringify(arrays[i])).techstack)
    }
    ids.reverse();  

    
    var z = stringSimilarity.findBestMatch(data.bio,bios)

    console.log(z)
    res.status(201).json({
        bios : bios,
        ids: ids,
        names: names,
        techstacks: techstacks,
        userId: data._id,
        username: data.name,
        userbio: data.bio
      });
}


exports.fetchProjs = async (req, res) => {    
    

    // console.log(dec.userId)
    // data = await Project.findOne({ _id: mongoose.Types.ObjectId(dec["userId"])}, 'name bio gitlink techstack').exec()
    
    // inpArr = (JSON.parse(JSON.stringify(data)).techstack)
    arrays = await Project.find({}).exec()
    console.log("Hiiiii")
    console.log(arrays)
    names = []
    ids = []
    desc = []
    techstacks = []

    for(i = 0; i<arrays.length; i++){
        names.push(arrays[i].Proj_name)
        ids.push(arrays[i]._id)
        desc.push(arrays[i].Desc)
        techstacks.push(JSON.parse(JSON.stringify(arrays[i])).Techstack)
    }
    // ids.reverse();  

    
    // var z = stringSimilarity.findBestMatch(data.bio,bios)

    // console.log(z)
    res.status(201).json({
        desc : desc,
        ids: ids,
        names: names,
        techstacks: techstacks,
      });
}


    
exports.getprojs = async (req, res, next) => {
    var projid = req.body.projid;
    console.log(req.body);
    Project.find({ _id: projid }, (err, info) => {
        console.log(info);
        res.send(info);
    })
}