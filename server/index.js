const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const users=[];

app.get('/',(req,res)=>{
    res.json(users)
})

app.post('/users',jsonParser,async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt();
        console.log(salt);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        console.log(hashedPassword);
        console.log(req.body);
        const user = {name:req.body.name,password:hashedPassword,salt:salt}
        users.push(user)
        res.status(201).send();

    }catch{
        console.log("something went wrong");
        res.status(500).send()
    }
})

app.post('/users/login',jsonParser,async(req,res)=>{
    const user = users.find(user=>user.name=req.body.name);
    if(user == null){
        return res.status(400).send("User not found")
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.status(200).send("successfull Login")
        }else{
            res.send("Password Not correct,Please re enter correct Password")
        }
    }catch{
        res.status(500).send("Internal Server Error")
    }
})

app.listen(9090,()=>{
    console.log("Login page....");
})