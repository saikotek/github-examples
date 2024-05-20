const core = require('@actions/core');
const github = require('@actions/github');

async function createComment(
    octokit,
    owner,
    repo,
    issueNumber,
    body
  ) {
    const {data: comment} = await octokit.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body
    })
    core.info(`Created comment id '${comment.id}' on issue '${issueNumber}'.`)
    return comment.id
  }

async function main() {
    try {
    const issueNumber = core.getInput('issue-number');
    console.log(`Issue number ${issueNumber}!`);
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    console.log(`Owner ${owner}, repo ${repo}, issueNumber ${issueNumber}!`);
    const comment = `Hello from the action!`;
    let id = await createComment(octokit, github.context.repo.owner, github.context.repo.repo, issueNumber, comment);
    core.info(`Created comment id '${id}' on issue '${issueNumber}'`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    } catch (error) {
    core.setFailed(error.message);
    }
}

main();