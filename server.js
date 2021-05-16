const express=require('express');
const bodyparser= require('body-parser');

const app=express();
app.use(bodyparser.json());

const database = {
    users: [
        {
            id:'123',
            name:'tehreem',
            email:'tehreem@gmail.com',
            password:'1234',
            entries:0,
            joined:new Date()
        },
        {
            id:'124',
            name:'smilga',
            email:'smilga@GMAIL.COM',
            password:'125555',
            entries:0,
            joined:new Date()
        }
    ]
}

app.get('/',(req,res)=>{
    res.send('this is express app'); 
})

app.post('/signin',(req,res)=>{
    if(req.body.email===database.users[0].email && 
    req.body.password===database.users[0].password){
    res.json('success');
    }else{
        res.status(400).json('error logging in');
    }
})

app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    database.users.push(
        {
            id:'125',
            name:name,
            email:email,
            password:password,
            entries:0,
            joined:new Date()
        }
    )
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req,res)=>{
    const {id} = req.params;
    let check=true;
    database.users.forEach(user=>{
        if(user.id=== id){
           check=!check;
            return res.json(user);
        }
    })
    if(check){
    res.status(400).json('user not found');}
})

app.post('/image', (req,res)=>{
    const {id} = req.body;
    let check=true;
    database.users.forEach(user=>{
        if(user.id=== id){
            check=!check;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(check){
    res.status(400).json('user not found');}
})

app.listen(3000,()=>{
    console.log('app running on port 3000....')
})   