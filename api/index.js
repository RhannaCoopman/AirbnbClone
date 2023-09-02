const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt')
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/booking");

const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'bufhjncd4sq79nru9efjkdn';

app.use(express.json());
app.use(cookieParser());

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}))

mongoose.connect(process.env.MONGO_URL)

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  console.log(email);

  const userDoc = await User.findOne({email});
  console.log(userDoc);

  if (userDoc) {
    console.log('userdoc: ' + userDoc)
    const passwordOK = bcrypt.compareSync(password, userDoc.password);

    if(passwordOK) {
      jwt.sign({
        email:userDoc.email, 
        id:userDoc._id,
        name:userDoc.name,},
        jwtSecret, 
        {}, 
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('password NOT OK');
    }
  } else {
    res.status(422).json('not found');
  }
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.get('/profile', async (req, res) => {
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }

});

app.post('/logout', async (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/uploadByLink', async (req, res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

app.post('/upload' ,async (req, res) => {
  const uploadedFiles = [];
  for (let index = 0; index < req.files.length; index++) {
    const {path, originalname} = req.files[index];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    uploadedFiles.push(newPath.replace('/uploads', ''));
  }
  res.json(uploadedFiles);
});

app.post('/places', async (req, res) => {
  const {token} = req.cookies;
  const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);

  });
});

app.get('/user-places', async (req, res) => {
  const {token} = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const {id} = userData;

    res.json( await Place.find({owner:id}));
  });
});

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const {token} = req.cookies;
  const {id, placeData} = req.body;
  const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = placeData;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
      });

      await placeDoc.save();
      res.json('ok');
    }
  });
});



app.get('/places', async (req, res) => {

    res.json( await Place.find());

});

app.get('/bookings', async (req, res) => {

  const {token} = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const {id} = userData;

    res.json( await Booking.find({user:id}).populate('place'));
  });
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);

  const {place, checkIn, checkOut, numberOfGuests, name, phone, price} = req.body;

  const booking = await Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price, user:userData.id,
  })

  res.json(booking);

})

app.listen(4000);