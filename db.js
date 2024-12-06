const mongoose = require("mongoose");
const backend_url = "mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/note_site";
mongoose.connect(backend_url);

const Schema =  mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const user = new Schema({
    email: { type: String,require:[true,"Enter email"] , unique: true },
    password: {type: String, require:[true , "Enter passward"]},
    firstName: {type: String, require:[true ,"Enter Name"]},
    lastName: String
});

const note = new Schema({
    title: String,
    content: String,
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
})

const userModel = mongoose.model("user" , user);
const noteModal = mongoose.model("note" , note);


module.exports = {userModel , noteModal};

