const express = require("express")
const path = require("path")
const adminRouter = require("./routes/adminRouter")
const { connection } = require("./config/db")
const port=8080
const app=express()
const cookie = require("cookie-parser")

app.set('view engine',"ejs")
app.use("/assets",express.static(path.join(__dirname,"/assets")))
app.use("/uploads",express.static(path.join(__dirname,"/uploads")))
app.use(express.urlencoded({extended:true}))
app.use(cookie())

app.use("/",adminRouter)

app.listen(port,(error)=>{
    if(error){
        console.log(error);
        return
    }
    connection()
    console.log(`server is running ${port}`);

})