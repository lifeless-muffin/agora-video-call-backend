const dotenv = require('dotenv');
const express = require('express');
const {nocache} = require('./middlewares/nocache');
const { generateRTCToken } = require('./services/agora.service');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
app.use("/", router)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const handleTokenGeneration = (req, resp) => {
	return generateRTCToken({req, resp, APP_ID, APP_CERTIFICATE});
}

const handleChannelCreation = (req, resp) => {
	return createNewChannel({req, resp, APP_ID, APP_CERTIFICATE});
}

const handleChannelJoining = (req, resp) => {
  return joinChannel({req, resp, APP_ID, APP_CERTIFICATE});
}

// routes
router.get('/rtc/:channel/:role/:tokenType/:uid', nocache, handleTokenGeneration);
router.post('/create/:channel/:role/:tokenType/:uid', nocache, handleChannelCreation);
router.post('/join/:channel/:role/:tokenType/:uid', nocache, handleChannelJoining);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {app.listen(PORT, () => {console.log(`Listening to port: ${PORT}`);})})
	.catch((err) => console.error(err))

