const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

// Let's Get the Private key
let keypath = Runtime.getAssets()['/github.key'].path;
const private_key = fs.readFileSync(keypath, 'utf8');

// Let's get the GitHub specific Functions to Respond to Webhooks
const { getInstallation, autopilotResponse } = require(Runtime.getFunctions()['github'].path);

function unpackResponse(autopilot_response){
  if(typeof autopilot_response == "object" ){
    for(propName in autopilot_response){
      if ((propName == "text") || (propName == "speech")) {
        return autopilot_response[propName]
      }
      else {
        return unpackResponse(autopilot_response[propName])
      }
    }
  }
  else if(typeof autopilot_response == "string"){
    return autopilot_response
  }
}

exports.handler = function(context, event, callback) {

  const { action } = event;

  if(action == "created" || action == "opened"){
    const { body } = event.comment;
    const { login, type } = event.comment.user;

    // Don't respond to Bots
    if(type == "Bot"){
      return callback(null);
    }

    const { number } = event.issue;
    const repo = event.repository.name;
    const owner = event.repository.owner.login;

    // Let's get ready to send this to Autopilot Endpoint using Axios
    autopilot = `https://channels.autopilot.twilio.com/v2/${context.ACCOUNT_SID}/${context.ASSISTANT_SID}/custom/GitHub`

    const autopilot_data = qs.stringify({
      'UserId': login,
      'Text': body,
      'Language': 'en-us' 
    });

    const autopilot_config = {
      method: 'post',
      url: autopilot,
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN
      },
      data : autopilot_data
    };

    // Let's get the GitHub App's InstallationId
    getInstallation(context.GITHUB_APP_ID,private_key,owner,repo).then(installationAccessToken =>{

      // Let's get a Response from Autopilot
      axios(autopilot_config).then(autopilot_response => {
        let unpacked_response =  unpackResponse(autopilot_response.data.response);

        autopilotResponse(installationAccessToken, owner, repo, number, unpacked_response).then(issue => {
          return callback();
        })
      })

    })
  }
  else{
    return callback(null);
  }

}