const express = require ("express");
const adminModel = require("../models/adminModel");
const fs= require ("fs")
const path = require("path")
const adminRouter = express.Router();

adminRouter.get("/",(req,res)=>{
    console.log(req.cookies.adminStore);
    if(req.cookies.adminStore){
        return res.render("dahboard")
    }else{
        return res.redirect("/")
    }
});
adminRouter.get("/signup",(req,res)=>{
    res.render("signUp")
});
adminRouter.get("/dahboard",(req,res)=>{
    console.log(req.cookies.adminStore);
    if(req.cookies.adminStore){
        return res.render("dahboard")
    }else{
        return res.redirect("/")
    }
});
adminRouter.get("/adminEdit/:id",async(req,res)=>{
    try {
        const getAdmin = await adminModel.findById(req.params.id)
        return res.render("editAdmin",{getAdmin : getAdmin})
    } catch (error) {
        console.log(error);
        return res.redirect("back")
    }
    console.log(req.cookies.adminStore);
    if(req.cookies.adminStore){
        return res.render("dahboard")
    }else{
        return res.redirect("/")
    }
});
adminRouter.post("/updateAdmin",adminModel.uploadImage,async(req,res)=>{
   if(req.file){
    const findData = await adminModel.findById(req.body.id)
    if(findData){
        const imgpath = findData.image
        fs.unlinkSync(path.join(__dirname,"..",imgpath));
        await adminModel.findByIdAndDelete(req.params.id);
        req.body.image=adminModel.adminUploadPath + "/" + req.file.filename
        await adminModel.findByIdAndUpdate(req.body.id,req.body)
        console.log("done");
        return res.redirect("/viewAdmin")
        
    }
    else{
        console.log("admin not found");
        return res.redirect("/")
    }
   }
   console.log(req.cookies.adminStore);
    if(req.cookies.adminStore){
        return res.render("dahboard")
    }else{
        return res.redirect("/")
    }
});
adminRouter.get("/viewAdmin",async(req,res)=>{
    try {
        const adminData = await adminModel.find({});
    res.render("viewAdmin",{adminData : adminData})
    } catch (error) {
        console.log(error );
        res.redirect("/")
    }
});


adminRouter.post("/createAdmin",adminModel.uploadImage,async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    try {
        if(req.file){
            req.body.image=adminModel.adminUploadPath + "/" + req.file.filename
            await adminModel.create(req.body)
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
})

adminRouter.get("/adminDelete/:id",async(req,res)=>{
    try {
        const getAdmin = await adminModel.findById(req.params.id)
        if(getAdmin){
            const imgpath = getAdmin.image
            fs.unlinkSync(path.join(__dirname,"..",imgpath));
            await adminModel.findByIdAndDelete(req.params.id);
            console.log(" deleted ");
            return res.redirect("/viewAdmin")
        }   
        else{
            res.status(404).send("Admin not found")
            return res.redirect("/")
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})

adminRouter.post("/checklogin",async(req,res)=>{
    console.log(req.body);
    try {
        const adminData = await adminModel.findOne({email : req.body.email})
        if(adminData){
            if(adminData.password == req.body.password){
                res.cookie("adminStore",adminData)
                res.redirect("/dahboard")
            }else{
                console.log("invalid pass");
                return res.redirect("/")
            }
        }else{
            console.log("invalid email or pass");
            return res.redirect("/")
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})
module.exports = adminRouter