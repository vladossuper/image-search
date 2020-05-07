const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const download = require('download');
// const archiver = require('archiver');
const zipafolder = require('zip-a-folder');

const User = require('./models/User');
const History = require('./models/History');
const imageSearch = require('image-search-google');

const API_KEY = 'AIzaSyDRMyJSzeP6ySc-HGav9-WzxzTlQCBQCIk';
const CSE_ID = '011047719248783927992:rkobvfefre8';

mongoose.connect('mongodb+srv://admin:admin@cluster0-o6nle.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true })
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.post('/register', (req, res, next) => {
    const { name, surname, email, password } = req.body;
    const newUser = new User({
        email: email,
        name: name,
        surname: surname,
        password: bcrypt.hashSync(password, 10)
    })
    newUser.save(err => {
        if (err) {
          return res.status(400).json({
              title: 'error',
              error: 'email in use'
          })
        }
        return res.status(200).json({
            title: 'signup success'
        })
    })
})

app.post('/sethistory', (req, res, next) => {
  const { history, id } = req.body;
  console.log(history);
  const newHistory = new History({
    history: history,
    user_id: id
  });
  newHistory.save(err => {
    if (err) {
      return res.status(400).json({
          title: 'error',
          error: 'something went wrong'
      })
    }
    return res.status(200).json({
        title: 'history write success'
    })
  })
});

app.post('/histories', (req, res, next) => {
  const { id } = req.body;
  History.find( { user_id: id }, (err, history) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    })
    if (!history) {
      return res.status(401).json({
          title: 'history not found',
          error: 'invalid credentials'
      })
    }
    return res.status(200).json({
      title: 'history success',
      history: history.map(item => item.history)
    })
  })
})

app.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) return res.status(500).json({
          title: 'server error',
          error: err
        })
        if (!user) {
          return res.status(401).json({
              title: 'user not found',
              error: 'invalid credentials'
          })
        }
        //incorrect password
        if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
            titte: 'login failed',
            error: 'invalid credentials'
        })
        }
        //IF ALL IS GOOD create a token and send to frontend
        let token = jwt.sign({ userId: user._id}, 'secretkey');
        return res.status(200).json({
          title: 'login sucess',
          token: token
        })
    })
})

//grabbing user info
app.get('/user', (req, res, next) => {
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    User.findOne({ _id: decoded.userId }, (err, user) => {
      if (err) return console.log(err)
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          email: user.email,
          name: user.name,
          id: user._id
        }
      })
    })

  })
});

app.post('/imagesearch', async (req, res, next) => {
  const { search, num, page, size, colorType, type, dominantColor } = req.body;
  const client = new imageSearch(CSE_ID, API_KEY);
  try {
    const response = await client.search(search, { num: +num, page, size, colorType, type, dominantColor });
    res.send(response);
  } catch(err) {
    console.log(err);
  }
});

app.post('/filters', (req, res, next) => {
    const filters = {};

    filters.imgSizes = [
      { title: 'Icon', value: 'icon' },
      { title: 'Small', value: 'small' },
      { title: 'Medium', value: 'medium' },
      { title: 'Large', value: 'large' },
      { title: 'Xlarge', value: 'xlarge' },
      { title: 'XXlarge', value: 'xxlarge' },
      { title: 'Huge', value: 'huge' },
  ];

  filters.imgColorTypes = [
      { title: 'Color', value: 'color' },
      { title: 'Gray', value: 'gray' },
      { title: 'Mono', value: 'mono' },
      { title: 'Transparent', value: 'trans' }
  ];

  filters.imgDominantColor = [
    { title: 'Black', value: 'black' },
    { title: 'Blue', value: 'blue' },
    { title: 'Brown', value: 'brown' },
    { title: 'Gray', value: 'gray' },
    { title: 'Green', value: 'green' },
    { title: 'Orange', value: 'orange' },
    { title: 'Pink', value: 'pink' },
    { title: 'Purple', value: 'purple' },
    { title: 'Red', value: 'red' },
    { title: 'Red', value: 'red' },
    { title: 'White', value: 'white' },
    { title: 'Yellow', value: 'yellow' }
  ];

  filters.imgType = [
    { title: 'Clipart', value: 'clipart' },
    { title: 'Face', value: 'face' },
    { title: 'Lineart', value: 'lineart' },
    { title: 'Stock', value: 'stock' },
    { title: 'Photo', value: 'photo' },
    { title: 'Animated', value: 'animated' }
  ];

  res.send(filters);
});

app.post('/download', async (req, res, next) => {
  let counter = 0;
  const { folder, downloadImages } = req.body;
  try {
    fs.mkdirSync(folder);
    downloadImages.map(async image => {
      try {
        const data = await download(image.url);
        fs.writeFileSync(`${ folder }/${ folder }${ counter++ }.jpg`, data);
        fs.readdir(`./${ folder }`, (err, files) => {
          if (files.length === downloadImages.length) {
            zipafolder.zipFolder(`./${ folder }`, `./${ folder }.zip`, () => {
              if (fs.existsSync(`./${ folder }.zip`)) {
                res.status(200).json({
                  title: 'success'
                })
              }
            });
          };
        })
      } catch(err) {
        console.log(err)
      }
    });
  } catch(err) {
    if (err.code === 'EEXIST') {
      res.status(409).json({
        title: 'Folder was already exist',
        error: 'Conflict'
      })
    } else {
      console.log(err);
    }
  }
  
});

app.post('/setfiledata', (req, res) => {
  const { coordinates, name } = req.body;
  console.log(coordinates);
  if (coordinates && name) {
    fs.writeFileSync(`${ name }.txt`, `width: ${coordinates.width}, height:${coordinates.height}, top:${coordinates.top}, left:${coordinates.left}`);
    if (fs.existsSync(`./${name}.txt`)) {
      res.status(200).json({
        title: 'success'
      })
    }
  }
})

app.post('/downloadfile', (req, res) => {
  const { name } = req.body;
  res.sendFile(`${ name }.txt`, { root: __dirname });
})

app.post('/downloadarchive', (req, res, next) => {
  const { folder } = req.body;
  res.sendFile(`${ folder }.zip`, { root: __dirname })
})
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('server running on port ' + port);
});