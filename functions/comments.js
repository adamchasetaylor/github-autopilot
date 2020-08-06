const axios = require('axios');
var qs = require('qs');

exports.handler = function(context, event, callback) {
  payload = JSON.parse(event.payload);

  ACCOUNT_SID = context.ACCOUNT_SID;
  ASSISTANT_SID = context.ASSISTANT_SID;

  const { action } = payload;
  const { body } = payload.comment;
  const { login } = payload.comment.user;
  const { id } = payload.repository;

  console.log(payload);

  const data = qs.stringify({
    'UserId': id,
    'Text': body,
    'Language': 'en-us' 
  });

  autopilot = `https://channels.autopilot.twilio.com/v2/${ACCOUNT_SID}/${ASSISTANT_SID}/custom/GitHub`

   var config = {
    method: 'post',
    url: autopilot,
    auth: {
      username: context.ACCOUNT_SID,
      password: context.AUTH_TOKEN
    },
    data : data
   };
   
   axios(config)
   .then(function (response) {
     console.log(JSON.stringify(response.data));
     callback(null,'OK')
   })
   .catch(function (error) {
    callback(error)
   });

}