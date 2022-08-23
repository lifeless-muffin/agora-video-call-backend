const ChannelModel = require("../models/channel");
const crypto = require("crypto");
const { generateRTCToken } = require("./agora.service");

const joinChannelValidation = ({req, resp}) => {
  if (!req?.body?.channelName) {
		resp.status(400).json({'error': 'channel name is required'});
		return false
  } else {
    return true;
  }
}

const createChannelValidation = ({req, resp}) => {
	if (!req?.body?.channelName) {
		resp.status(400).json({'error': 'channel name is required'});
		return false
	} else if (!req?.body?.channelHost) {
		resp.status(400).json({'error': 'channel host is required'});
		return false
	} else if (!req?.body?.channelTimeline || req.body?.channelTimeline.length < 1) {
		resp.status(400).json({'error': 'channel timeline is required'});
		return false
	} else {
		return true
	}
}

const createNewChannel = async ({req, resp, APP_CERTIFICATE, APP_ID}) => {
	const channelName = req.body?.channelName;
	const channelHost = req.body?.channelHost; // agora ID
	const channelTimeline = req.body?.channelTimeline;

	// if (createChannelValidation()) {}
	
	const channelId = crypto.randomBytes(16).toString("hex");
	// const totalDuration = channelTimeline.reduce((a,b) => a.duration + b.duration);
	const totalDuration = 300;
	const totalDurationInMi = Math.round(totalDuration * 1000);
	const currentDateInMi = Date.now();

	const channel = new ChannelModel({
		id: channelId,
		channelName: 'main',
		host: 'me',
		createdAt: currentDateInMi,
		expiresAt: currentDateInMi + totalDurationInMi,
		timeline: [{
			name: 'Break',
			duration: 300,
			index: 0,
			isBreak: true
		}]
	})

	await channel.save()
		.then((result) => {
      // generate token for the host or the person who created the room
      const generateToken = generateRTCToken({req, resp, APP_CERTIFICATE, APP_ID})

      // check for any errors with generating the token
      if (generateToken.error) {
        resp.status(generateToken.status_code)
          .json(generateToken?.error_message);
      };

      // send token + channel details
			resp.status(201).json({
        channelDetails: result, 
        rtcToken: generateToken.rtcToken
      });
		})
		
		.catch((err) => {
      console.log(err)
			resp.status(500).json(err);
		})
}

const joinChannel = ({req, resp, APP_ID, APP_CERTIFICATE}) => {
	const channelName = req.body?.channelName;

  if (!joinChannelValidation({req, resp})) {return null;}

  ChannelModel.find({channelName: channelName})
    .then((result) => {
      // generate token for the host or the person who created the room
      const generateToken = generateRTCToken({req, resp, APP_CERTIFICATE, APP_ID})

      // check for any errors with generating the token
      if (generateToken.error) {
        resp.status(generateToken.status_code)
          .json(generateToken?.error_message);
      };

      // send token + channel details
			resp.status(201).json({
        channelDetails: result, 
        rtcToken: generateToken.rtcToken
      });
    })
    .catch((err) => {
      console.log(err)
			resp.status(500).json(err);
    })
}

module.exports = {createNewChannel, joinChannel};
