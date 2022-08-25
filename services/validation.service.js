const validateJoinChannel = (channelDetails) => {
  const currentDateInMi = Date.now();

  if (!channelDetails || channelDetails?.length < 1) {
    return {error: true, error_message: "Channel does not exist", status_code: 400};
  } else if (channelDetails?.[0]?.expiresAt <= currentDateInMi) {
    return {error: true, error_message: "Channel has expired", status_code: 400};
  }

  return {error: false};
}

module.exports = {validateJoinChannel}