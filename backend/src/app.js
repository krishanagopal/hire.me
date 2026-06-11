const express = require("express");
const app =express();

app.use(express.json());

const routes = require("./routes");

app.use("/api/v1", routes);

app.get('/',(req,res)=>{
    res.json({
        success:true,
        message:"hire.me api running",
    });
});

module.exports =app;