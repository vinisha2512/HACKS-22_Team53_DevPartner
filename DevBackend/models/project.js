const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        Proj_name: { type: String, required: true },
        Desc: { type: String, required: true },
        Techstack: [{ type: String, requried: true }],
        Collaborators: [{ type: String, required: true }]
    }

);

let project = mongoose.model("Project", projectSchema);

module.exports = project;
