# githhub-autopilot

Basic GitHub bot using Twilio Autopilot and Octokit

![Screenshot](/Screenshot.png)

## Setup

Setup .env with your ACCOUNT_SID, AUTH_TOKEN, and ASSISTANT_SID from Twilio (for Autopilot) and your GITHUB_APP_ID (for GitHub)

Add your private key for github in the assets folder as "github.private.key".

## Deploy

twilio serverless:deploy

Update your [github app configuration](https://github.com/settings/apps/) to subscribe for webhooks to the bot for issues and issue comments.

Set the Webhook URL to the "assistant" function here.
