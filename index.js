/*! Copyright 2023 Ayogo Health Inc. */
import { spawnSync } from "node:child_process";

const GITHUB_API_VERSION = "2022-11-28";


function getEnvironments(repoName) {
  const [owner, repo] = repoName.split("/");

  const result = spawnSync("gh", [
    "api",
    "-H", `"Accept: application/vnd.github+json"`,
    "-H", `"X-GitHub-Api-Version: ${GITHUB_API_VERSION}"`,
    `/repos/${owner}/${repo}/environments`
  ], { shell: true });

  if (result.status === 0) {
    return JSON.parse(result.stdout.toString()).environments.map((e) => e.name);
  } else {
    throw new Error(result.stderr.toString());
  }
}

function createEnvironment(repoName, envName) {
  const [owner, repo] = repoName.split("/");

  const result = spawnSync("gh", [
    "api",
    "-H", `"Accept: application/vnd.github+json"`,
    "-H", `"X-GitHub-Api-Version: ${GITHUB_API_VERSION}"`,
    "-X", "PUT",
    `/repos/${owner}/${repo}/environments/${config.name}`
  ], { shell: true });

  if (result.status === 0) {
    console.log(`🟩 Created ${envName}...`);
  } else {
    throw new Error(result.stderr.toString());
  }
}

function createVariable(repoName, envName, variableName, variableValue) {
  const result = spawnSync("gh", [
    "variable", "set",
    "-e", envName,
    "-R", repoName,
    "-b", `"${variableValue}"`,
    variableName
  ], { shell: true });

  if (result.status === 0) {
    console.log(`    ▫️  Set variable ${variableName}`);
  } else {
    throw new Error(result.stderr.toString());
  }
}

function createSecret(repoName, envName, variableName, variableValue) {
  const result = spawnSync("gh", [
    "secret", "set",
    "-a", "actions",
    "-e", envName,
    "-R", repoName,
    "-b", `"${variableValue}"`,
    variableName
  ], { shell: true });

  if (result.status === 0) {
    console.log(`    ▫️  Set secret ${variableName}`);
  } else {
    throw new Error(result.stderr.toString());
  }
}

export async function provisionEnvironments(repoName, config) {
  const existingEnvs = await getEnvironments(repoName);

  Object.keys(config.environments).forEach((envName) => {
    if (!existingEnvs.includes(envName)) {
      createEnvironment(repoName, envName);
    } else {
      console.log(`🔹 Populating ${envName}...`);
    }

    const environment = config.environments[envName];

    if (environment.variables?.length) {
      environment.variables.forEach((variable) => {
        createVariable(repoName, envName, variable.name, variable.value);
      });
    }

    if (environment.secrets?.length) {
      environment.secrets.forEach((secret) => {
        createSecret(repoName, envName, secret.name, secret.value);
      });
    }
  });
}
