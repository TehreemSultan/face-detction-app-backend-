const express=require('express');
const bodyparser= require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db=knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smartbrain'
    }
});


const app=express();
app.use(bodyparser.json());
app.use(cors());

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
  
    
})

app.post('/signin',(req,res)=>{
   db.select('email','hash').from('login')
   .where('email','=',req.body.email)
   .then(data=>{
       const isvalid=bcrypt.compareSync(req.body.password,data[0].hash);
       if(isvalid){
           db.select('*').from('users')
           .where('email','=',req.body.email)
           .then(user=>{
               res.json(user[0])
           })
           .catch(err=>res.status(400).json('unable to get user'))
       }else{
           res.status(400).json('wrong credentials')
       }
   })
   .catch(err=>res.status(400).json('wrong credentials'))
})
  
app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    const hash=bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined:new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
   .catch(err => res.status(400).json('unable to register'));
    
})

app.get('/profile/:id', (req,res)=>{
    const {id} = req.params;
    db.select('*').from('users').where({id:id})
    .then(user=>{
        if(user.length){
            console.log("why")
            res.json(user)
        }else{
            res.status(400).json('user not found')
        }
       })
    .catch(err=>res.status(400).json('error getting user'));}
)

app.put('/image', (req,res)=>{
    const {id} = req.body;
   db('users').where('id','=',id).increment('entries',1).returning('entries')
   .then(entry=>{res.json(entry[0])})
   .catch(err=>res.status(400).json('unable to get count'))
})

app.listen(5000,()=>{
    console.log('app running on port 5000....')
})   