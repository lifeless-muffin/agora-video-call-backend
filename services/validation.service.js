const validateJoinChannel = (channelDetails) => {
  const dateTimeInSecs = Math.round(new Date().getTime() / 1000); // in seconds

  if (!channelDetails || channelDetails?.length < 1) {
    return {error: true, error_message: "Channel does not exist", status_code: 400};
  } else if (channelDetails?.[0]?.expiresAt <= dateTimeInSecs) {
    return {error: true, error_message: "Channel has expired", status_code: 400};
  }

  return {error: false};
}

module.exports = {validateJoinChannel}