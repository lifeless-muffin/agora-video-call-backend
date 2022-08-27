const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {nocache} = require('./middlewares/nocache');
const { generateRTCToken } = require('./services/agora.service');
const { createNewChannel, joinChannel } = require('./services/channels.service');
const router = express.Router();

dotenv.config();
const PORT = process.env.PORT || 3000;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const MONGODB_URI = process.env.MONGODB_URI;

// creating express app
const app = express();

// middlwares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router)

const handleTokenGeneration = (req, resp) => {
	return generateRTCToken({req, resp, APP_ID, APP_CERTIFICATE});
}

const handleChannelCreation = (req, resp) => {
	return createNewChannel({req, resp, APP_ID, APP_CERTIFICATE});
}

const handleChannelJoining = (req, resp) => {
  return joinChannel({req, resp, APP_ID, APP_CERTIFICATE});
}

const handleBaseRoute = (req, resp) => {
  return resp.status(200)
    .json('Connected to Agora Meet backend')
}

// routes
router.get('/rtc/:channel/:role/:tokenType/:uid', nocache, handleTokenGeneration); 
router.post('/create/:channel/:role/:tokenType/:username', nocache, handleChannelCreation);
router.get('/join/:channel/:role/:tokenType/:username', nocache, handleChannelJoining);
router.get('/', nocache, handleBaseRoute);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {app.listen(PORT, () => {console.log(`Listening to port: ${PORT}`);})})
	.catch((err) => console.error(err))

