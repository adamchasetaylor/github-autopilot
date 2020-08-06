const { App } = require("@octokit/app");
const { Octokit } = require("@octokit/rest");
const { request } = require("@octokit/request");

const getInstallation = async function(APP_ID, PRIVATE_KEY, owner, repo) {   

    const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
    const jwt = app.getSignedJsonWebToken();
    
    // Example of using authenticated app to GET an individual installation
    // https://docs.github.com/en/rest/reference/apps#find-repository-installation
    const { data } = await request('GET /repos/{owner}/{repo}/installation', {
      owner: owner,
      repo: repo,
      headers: {
        authorization: `Bearer ${jwt}`,
        accept: "application/vnd.github.machine-man-preview+json",
      },
    });

    installationId = data.id;

    const installationAccessToken = await app.getInstallationAccessToken({
      installationId,
    });

    return installationAccessToken;
}

// Create Issue Comment
const autopilotResponse = async function(installationAccessToken, owner, repo, issue_number, body) {
  // https://docs.github.com/en/rest/reference/issues#create-an-issue-comment
  const { data } = await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner: owner,
    repo: repo,
    issue_number: issue_number,
    body: body,
    headers: {
      authorization: `token ${installationAccessToken}`,
      accept: "application/vnd.github.machine-man-preview+json",
    }
  });

  return data.url;
}

exports.getInstallation = getInstallation;
exports.autopilotResponse = autopilotResponse;