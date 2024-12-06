const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/note_site");
const { userModel , noteModal } = require("./db.js");
const jwt = require('jsonwebtoken');
const JWT_KEY_user = "key1234";
const { userMiddleware } = require("./middlewere/usermidd.js");
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


//singup
app.post("/signup", async function(req, res) {
    try{
        const { email, password, firstName, lastName } = req.body;
        await userModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        });
        res.json({ msg: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Server error" });
    }
});


//signin
app.post("/signin", async function(req, res) {
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email , password:password });
        if (!user) {
            return res.status(404).json({ msg: "User not found" }); 
        }else{
            const token = jwt.sign({ id: user._id.toString() }, JWT_KEY_user);
            res.json({ token: token, role: user.role });
        }
    }catch(e){
        res.status(403).json({ msg: "Invalid credentials" });
    }
});


app.post("/note" , userMiddleware,async function(req, res) {
    try{
        const { title, content } = req.body;
        const user = await userModel.findOne({ _id: req.userId });
        console.log("User ID from token:", req.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" }); 
        }else{
            await noteModal.create({
                title:title,
                content:content,
                creatorId:req.userId
            })
        }
    }catch(e){
        res.status(403).json({ msg: "Invalid credentials" });
    }
})

//display
app.get("/notes", userMiddleware ,async function(req, res) {
    const note = await noteModal.find({creatorId: req.userId});
    res.json({ Notes: note });
});


//delete
app.delete('/note/:id', userMiddleware, async (req, res) => {
    try {
        await noteModal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
});

//update
app.put('/note/:id', userMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const noteId = req.params.id;

        // Find the note and check ownership
        const note = await noteModal.findOne({ _id: noteId, creatorId: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized access' });
        }

        // Update the note
        note.title = title || note.title;
        note.content = content || note.content;
        await note.save();

        res.json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating note' });
    }
});



app.listen(3000);
console.log("listening on port 3000");