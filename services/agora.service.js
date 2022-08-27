const { RtcRole, RtcTokenBuilder } = require("agora-access-token");

// we'll generate the token here
const generateRTCToken = ({clientId, req, resp, APP_CERTIFICATE, APP_ID, ...props}) => {
	const uid = clientId;
	const channelName = req.params.channel;
	const tokenType = req.params.tokenType;
	let role = req.params.role;	
	
	if (!uid || uid === "") {
		return {error: true, status_code: 400, error_message: 'uid is required'}
	} else if (!channelName) {
		return {error: true, status_code: 400, error_message: 'channel name is required'}
	} else if (!role) {
		return {error: true, status_code: 400, error_message: 'role is required'}
	} 
	
	if (role === "publisher") {
		role = RtcRole.PUBLISHER; 
	} else if (role === "audience") {
		role = RtcRole.SUBSCRIBER;
	} else {
		return {error: true, status_code: 400, error_message: 'role is required'}
	}
	
	const expireTime = 3600; // because... test purposes only
	const currentTime = Math.floor(Date.now() / 1000);
	const privilegeExpireTime = currentTime + expireTime;	

	let token = "";
	if (tokenType === 'userAccount') {
		token = RtcTokenBuilder
			.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, 
				channelName, uid, role, privilegeExpireTime)
	} else if (tokenType === "uid") {
		token = RtcTokenBuilder
			.buildTokenWithUid(APP_ID, APP_CERTIFICATE, 
				channelName, uid, role, privilegeExpireTime)
	} else {
		return {error: true, status_code: 400, error_message: 'token type is required'}
	}

	return {error: false, status_code: 200, rtcToken: token};
}

module.exports = {generateRTCToken}