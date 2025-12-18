const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require ('dotenv')
const cors = require('cors');
app.use(cors());

dotenv.config()
mongoose.connect('mongodb://localhost:27017/application', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB using Mongoose');
});

app.listen(5000,()=>{
  console.log(' Server running on http://localhost:5000');
});

const User = require("./User")
const Rate = require("./Rate")
const Message = require("./Message")
const Appointment = require("./Appointment")
const MentorTime = require("./MentorTime")
const Request = require("./Request")

//creating rate
app.post('/api/rate',async (req,res)=>{
  const {student_id , mentor_id , value}= req.body;
  try{
    const student = await User.findById(student_id);
    const mentor = await User.findById(mentor_id);

    if (!student || student.function !== 'student') {
      return res.status(400).json({ error: 'Invalid student_id' });
    }

    if (!mentor || mentor.function !== 'mentor') {
      return res.status(400).json({ error: 'Invalid mentor_id' });
    }

    const rate = new Rate({ student_id, mentor_id, value });
    await rate.save();

    res.status(201).json({ message: 'Rating saved!', rate });
  } catch(error){
    res.status(500).json({error: 'Server error',details: error.message});
  }
});
//creating user
app.post('/api/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
                              ...req.body,
                              password:hashedPassword,
                            });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User saved!', user: savedUser });
  } catch (error) {
    res.status(400).json({ error: 'Failed to save user', details: error.message });
  }
});
//authentification
app.post('/api/users/login',async (req,res) => {
  //user authentification
  console.log(req.body)
  try{
    const user = await User.findOne({mail :req.body.mail})
    if (!user){
      return res.status(400).json({ error: 'User not found' });
    }
    const isValid = await bcrypt.compare(req.body.password,user.password)
    if(!isValid){
     
      return res.status(401).json({ error: 'Invalid password' });
    } 
    const payload = { id: user._id, name: user.name, mail: user.mail };
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET)
    res.json({accessToken, refreshToken})
  }catch (error) {
    res.status(400).json({ error: 'Failed to logged in', details: error.message });
  }
})


function generateAccessToken(user) {
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
}
//creating msg
app.post('/api/message', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const message = new Message({ sender, receiver, content });
    await message.save();

    res.status(201).json({ message: 'Message sent!', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
//creating appointment
app.post('/api/appointment',async(req,res)=>{
  try{
    const {mentor, state , time , student ,request} = req.body;
    const appointment = new Appointment({mentor, state , time, student ,request});
    await appointment.save();
    res.status(201).json({message : 'Appointment made ! ', data : appointment});

  }catch (error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})





//let's work on reading data
//reading message 
app.get('/api/message', async (req, res) => {
  try {
    const messages = await Message.find(); 
    res.status(200).json({ message: 'Messages retrieved', data: messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
//reading appointment
app.get('/api/appointment',async(req,res)=>{
  try{
    const appointments = await Appointment.find();
    res.status(200).json({message : 'Appointments retrieved', data: appointments});
  }catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})

app.get('/api/mentorTime/:mentorId', async (req, res) => {
  try {
    const mentor_time = await MentorTime.find({ user: req.params.mentorId });
    res.status(200).json({ message: 'Times retrieved', data: mentor_time });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

//reading rates
app.get('/api/rate',async(req,res)=>{
  try{
    const rates = await Rate.find();
    res.status(200).json({message : 'Rates retrieved', data:rates});
  }catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})
//reading users
app.get('/api/users',async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json({message : 'Users retrieved', data:users});
  }catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})

const verifyToken = require('./authMiddleware');

app.get('/api/profile',verifyToken,async(req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({message : 'User retrieved', data:user});
  }catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})
app.patch("/api/profile", verifyToken, async (req, res) => {
  // allow nested fields too
  const allowed = [
    "name",
    "surname",
    "mail",
    "function",
    "uni.uni_name",
    "uni.position",
    "major.major_name",
    "level",
  ];

  const updates = {};
  allowed.forEach((path) => {
    // walk through nested paths
    const value = path.split(".").reduce((obj, key) => obj?.[key], req.body);
    if (value !== undefined) updates[path] = value;
  });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid update data" });
  }
});

app.get('/api/users/login/info', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      name: user.name,
      surname: user.surname
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.get('/api/users/login/calendar',verifyToken,async(req,res)=>{
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      id : req.user.id,
      function: user.function
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})
app.get('/api/users/notif/:id',async(req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      name : user.name,
      surname: user.surname
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})
app.get('/api/users/:id',verifyToken,async(req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      name : user.name,
      surname: user.surname
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})

// let's work on updating our data
//updating content == editing msg
app.patch('/api/message/:id',async(req,res)=>{
  try{
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({message: 'content updated' , data : updatedMessage});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//updating appointment == changing dates/ money
app.patch('/api/appointment/:id',async(req,res)=>{
  try{
    const {id}  = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if(!updatedAppointment){
      return res.status(404).json({ message: 'No updates included' });
    }
    res.status(200).json({message: 'appointment updated',data : updatedAppointment});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//updating mentorTime
app.patch('/api/mentorTime/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const updatedTime = await MentorTime.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if (!updatedTime){
      return res.status(404).json({ message: 'No time updates included' });
    }
    res.status(200).json({message: 'time updated',data : updatedTime});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//updating rating === editing value
app.patch('/api/rate/:id',async(req,res)=>{
  try{
    const {id}  = req.params;
    const updatedRate = await Rate.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if(!updatedRate){
      return res.status(404).json({ message: 'No Rate included' });
    }
    res.status(200).json({message: 'rate updated',data : updatedRate});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//updating user info : 
//may change : uni /level/ major/function/mail
app.patch('/api/users/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if (!updatedUser){
      return res.status(404).json({ message: 'No User updates included' });
    }
    res.status(200).json({message: 'User updated',data : updatedUser});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})

app.patch('/api/users/login/function', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const { function: newFunction } = req.body;
  if (!newFunction) {
    return res.status(400).json({ error: 'New function is required' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { function: newFunction },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      message: 'Function updated successfully',
      function: updatedUser.function,
    });
  } catch (error) {
    console.error('Error updating user function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//deleting
//deleting message
app.delete('/api/message/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage){
      return res.status(404).json({message : 'nothing to delete'});
    }
    res.status(200).json({message: 'message deleted', data: deletedMessage});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//deleting appointment
app.delete('/api/appointment/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if(!deletedAppointment){
      return res.status(404).json({message : 'nothing to delete'});
    }
    res.status(200).json({message: 'appointment annuled', data: deletedAppointment});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//deleting mentorTime
app.delete('/api/mentorTime/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedTime = await MentorTime.findByIdAndDelete(id);
    if(!deletedTime){
      return res.status(404).json({message : 'nothing to delete'});
    }
    res.status(200).json({message:'time deleted',data: deletedTime});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//deleting rate
app.delete('/api/rate/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedRate = await Rate.findByIdAndDelete(id);
    if(!deletedRate){
      return res.status(404).json({message : 'nothing to delete'});
    }
    res.status(200).json({message:'rate deleted',data: deletedRate});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})
//deleting user
app.delete('/api/users/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if(!deletedUser){
      return res.status(404).json({message : 'nothing to delete'});
    }
    res.status(200).json({message:'user deleted',data: deletedUser});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
})



//request
app.post('/api/requests', async (req, res) => {
  try {
    const { sender, receiver, subject, description,time } = req.body;

    const newRequest = new Request({
      sender,
      receiver,
      subject,
      description,
      time
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created', data: newRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
});
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find()
    res.status(200).json({ message: 'Requests retrieved', data: requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
  }
});
app.get('/api/requests/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
    if (!request) return res.status(404).json({ error: 'Request not found' });

    res.status(200).json({ message: 'Request found', data: request });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get request', details: error.message });
  }
});


app.patch('/api/requests/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      req.body,
      {
        new:true,
        runValidators:true
      }
    );
    if (!updatedRequest){
      return res.status(404).json({ message: 'No User updates included' });
    }
    res.status(200).json({message: 'User updated',data : updatedRequest});
  }catch(error){
    res.status(500).json({error: 'Server error' , details: error.message});
  }
});
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);

    if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });

    res.status(200).json({ message: 'Request deleted', data: deletedRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request', details: error.message });
  }
});
app.patch('/api/requests/:id/accept',  verifyToken, async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  if (request.receiver.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  request.status = 'accepted';
  await request.save();

  res.json({ message: 'Request accepted', data: request });
});

//creating mentor_time
app.post('/api/mentorTime',verifyToken,async(req,res)=>{
  const { start_time, end_time, money } = req.body;
  try {
    const userId = req.user.id;
    const mentor = await User.findById(userId);
    if (!mentor || mentor.function !== 'mentor') {
      return res.status(400).json({ error: 'Invalid mentor' });
    }
    const contact = new MentorTime({
      user: userId,
      start_time,
      end_time,
      money,
    });
    await contact.save();
    res.status(201).json({ message: 'time set', data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
//reading mentorTime
app.get('/api/mentorTime',verifyToken,async(req,res)=>{
  try{
    const mentor_time = await MentorTime.find({ user: req.user.id });
    res.status(200).json({message : 'times retrieved', data: mentor_time});
  }catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
})
app.get('/api/appointment',verifyToken,async(req,res)=>{
   try {
    const query = req.user.function === 'student'
      ? { student: req.user.id }
      : { mentor : req.user.id };

    const appointments = await Appointment.find(query)
      .populate({           
        path: req.user.function === 'student' ? 'mentor' : 'student',
        select: 'name surname'
      })
      .populate({               
        path: 'request',
        select: 'subject description status',         
        populate: [                                    
          { path: 'sender',   select: 'name surname' },
          { path: 'receiver', select: 'name surname' }
        ]
      })
      .lean();                 

    res.json({ data: appointments });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
})
app.get('/api/accepted', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const roleKey = user.function === 'student' ? 'sender' : 'receiver';
    if (!req.user.id) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }
    const requests = await Request.find({
      [roleKey]: req.user.id,   
      status: 'accepted'       
    }).populate('receiver', 'name surname').populate('sender', 'name surname').lean()
    console.log('User ID:', req.user.id);
    console.log('User function:', user.function);
    console.log('Filtering by:', roleKey);

    return res.status(200).json({ data: requests });
  } catch (err) { 
    return res.status(500).json({ error: 'Failed to fetch requests', details: err.message });
  }
});