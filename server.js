 const express = require('express')
 const path = require('path')
 const app = express()
 app.set('view engine', 'ejs')
 app.set('views', path.join(__dirname, '/views'))
 const bcrypt = require('bcrypt') // TO hash Password
 const session = require('express-session')// to connect session
 const flash = require('connect-flash') // to connect flash

 // to style using css link use the function AND SETTING UP PUBLIC ASSET
 app.use(express.static(path.join(__dirname, 'Public')))
 app.use(express.json()) // for parsing application/json 
 app.use(express.urlencoded({extended:true}))//for parsing application/x-www-form-urlencode
//express.json and express.urlencoded are know as body parsers which helps to collect data.

  // Mongoosejs.com is a documentation for mongoose
 // connecting to database on server side
 const connectDB = require('./utils/connectDB')
    connectDB()

// Requiring or getting your schema
const User = require('./model/registrationSchema')

//Admin schema
const Admins = require('./model/adminReg')

// set up  our flash with session(some using that browser at the moment)
app.use(session({
   secret: 'Ketboard cat',
   saveUninitialized: true,
   resave: true,
}))
// for passing messages to frontend
app.use(flash());


 // Rendering different pages or consuming endpoint handler
 app.get('/',(req,res)=>{
    res.render('index.ejs')

 })
 app.get('/about',(req,res)=>{
    res.render('about.ejs')

 })
 app.get('/courses',(req,res)=>{
    res.render('courses.ejs', {data})

 })
 

 const username = 'SammyDev'
 const allCourse = ['WDD','Graphic Design', 'Microsoft'];
 const rand = Math.floor(Math.random()*10)+1;
// Passing or rendering different or more than one array or object on page
 const data = {
   allCourse: allCourse,
   username: username,
   rand: rand
 }


 const Port = 3000
 app.listen(Port,()=>{
    console.log(`Listening to Port ${Port}`)
 })

 // requiring or getting exported data
 const result = require('./views/data')
//  console.log(result)

 app.get('/users',(req,res)=>{
   res.render('users.ejs', {result})

})
// forget password
 app.get('/forgetPassword',(req,res)=>{
   res.render('forgetPassword.ejs', {messages:req.flash('info')})

}) 
 app.get('/allUsers',(req,res)=>{
   res.render('allUsers.ejs', {result})

})
 app.get('/api',(req,res)=>{
   res.render('api.ejs')

})
 app.get('/register',(req,res)=>{
   res.render('register.ejs', {messages:req.flash('info')})

})
 
//  app.post('/registration', async(req,res)=>{
//    try {
//       const {username, password} = req.body
//    console.log({username, password})
//    const users = new User ({
//       username: username,
//       password: password,
//       // settings on programmers side which the user has no control
//       role: 'User',
//       active: true

//    })
//    await users.save()}
   
//    catch (error) {
//       console.log(error)
//    }

   

//    if(username.length<4||password.length<7){
//      // res.status(403).json({message:'Invalid credentials'})
//   // }else{ res.status(200).json({message:'User registeration successfull'})}
// res.redirect('/register')}
//  else{res.redirect('/dashboard')}

  

//})
// To make a particular property a topic or search interest
// app.get('/:username', (req,res)=>{
//    const {username} = req.params
//    console.log(username)
//    const userInfo = result.find((el)=>{
//       return el.username === username
//    })
//    if(userInfo&&userInfo){
//       // console.log(userInfo)
//    res.render('userData.ejs', {...userInfo})

//    }
   
// })

app.get('/login',(req,res)=>{
   res.render('login.ejs', {messages:req.flash('info')})
})


app.post('/registration', async (req, res) => {
   try {
       const{username, password, fullname, passport, phone} = req.body

       const foundUser = await User.findOne({username:username})
       if(foundUser){
         req.flash('info', 'User Alredy Exist!')
         res.redirect('/register')
       }
       const hashedPassword = await bcrypt.hash(password, 12) 
       // 12 is the salt round

       const user = new User ({
           username: username,
           password: hashedPassword,
           role: 'User',
           active: true,
           fullname:fullname,
           passport:passport,
           phone:phone

       })
       console.log({username, hashedPassword})

       await user.save()

       res.redirect('/login')

   } catch (error) {
       console.log(error);
   }

   
})



// app.post('/login', async(req,res)=>{

//    const {username, password} = req.body
//    console.log({username, password})
//    const foundUser = await User.findOne({username:username})
//    console.log(foundUser)

//    const user = await bcrypt.compare(password,foundUser.password)

//    if(user){
//       req.flash('info', 'Username or Password is incorrect!')
//       res.redirect('/dashboard')
//    } else{
//       res.redirect('/login')
//    }
//    })


   // Login for ADMIN AND USER

   let foundUser

   app.post('/login', async(req,res)=>{

      const {username, password} = req.body
      console.log({username, password})

    foundUser = await User.findOne({username:username})
      if(foundUser){
         const user = await bcrypt.compare(password,foundUser.password)
   
      if(user){
         
         res.redirect('/dashboard')
      } else{
         req.flash('info', 'Username or Password is incorrect!')
         res.redirect('/login')
      }

      }
      else{
         const foundAdmin = await Admins.findOne({username:username})
         if(foundAdmin){
            const user = await bcrypt.compare(password,foundAdmin.password)
      
         if(user){
            res.redirect('/AdminDashboard')
         } 
         else{
            req.flash('info', 'Password or Username incorrect!')
            res.redirect('/login')
         }
   
      }
      
      }
   })

   app.get('/dashboard',(req,res)=>{
      res.render('dashboard.ejs', {foundUser})
   
   })

   // For Admin
  
   app.get('/Admin',(req,res)=>{
      res.render('adminReg.ejs', {messages:req.flash('info')})
   })
   app.get('/AdminDashboard',async (req,res)=>{
      const allUsers = await User.find()
      console.log(allUsers)
   res.render('adminDashBoard.ejs', {allUsers})
   })

   app.post('/Adminregistration', async (req, res) => {
      try {
          const{username, password} = req.body
   
          const foundAdmin = await Admins.findOne({username:username})
          if(foundAdmin){
            req.flash('info', 'User Alredy Exist!')
            res.redirect('/Admin')
          }
          const hashedPassword = await bcrypt.hash(password, 12) 
          // 12 is the salt round
   
          const Admin = new Admins ({
              username: username,
              password: hashedPassword,
              role: 'Admin',
              active: true
          })
          console.log({username, hashedPassword})
   
          await Admin.save()
   
          res.redirect('/login')
   
      } catch (error) {
          console.log(error);
      }
   
      
   })

//////Forget password or Updating
    app.post('/forgetPassword', async(req,res)=>{
      const {username, newpassword} = req.body
      console.log(username, newpassword);
      if(username.length<10 || newpassword.length<7){
         req.flash('info', 'Username must be greater than 10 and password must be greater than 7!')
         res.redirect('/forgetPassword')
      }
       else{
         const hashedPassword = await bcrypt.hash(newpassword, 10)
         await User.findOneAndUpdate({username:username}, { $set: { password:hashedPassword }})
         console.log(User)
         req.flash('info', 'Password Changed!')
         res.redirect('/login')
      }

})

//// Deleting a user by the admin
app.get('/:id', async(req, res)=>{
const {id} = req.params
await User.findByIdAndDelete({_id:id});
res.redirect('/AdminDashboard')

})


// Use nodemailer or emailjs to send emails 


app.get('/upload',(req,res)=>{
   res.render('upload.ejs', {foundUser})

})

//For uploading images
// mkdir Uploads
// cd uploads
// test using npm init -y
// npm install express multer
// require multer
const multer = require('multer')
// set up multer for file upload
const storage = multer.diskStorage({
   destination: './uploads',
   filename: function(req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
 });
 const upload = multer({
   storage: storage
 }).single('image');

 // Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Set up a route to handle file uploads
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error();
      res.send('An error occurred while uploading the file.');
    } else {
      res.send('File uploaded successfully.');
    }
  });
});
