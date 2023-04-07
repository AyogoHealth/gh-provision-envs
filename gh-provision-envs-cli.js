#!/usr/bin/env node
/*! Copyright 2023 Ayogo Health Inc. */

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { provisionEnvironments } from "./index.js";


const args = parseArgs({ allowPositionals: true, options: {}});
if (args.positionals.length < 1) {
  console.error(`Must provide a configuration file path`);
  process.exit(1);
}
if (args.positionals.length < 2) {
  console.error(`Must provide a repository name (in "owner/repo" format)`);
  process.exit(1);
}

const configFile = args.positionals[0];
const repoName = args.positionals[1];
let configData = {};

try {
  configData = JSON.parse(readFileSync(configFile, "utf8"));
} catch (e) {
  console.error(`Failed to load config file "${configFile}"`, e);
  process.exit(2);
}

if (!Object.hasOwn(configData, "environments")) {
  console.error(`Missing environments key in "${configFile}"`);
  process.exit(3);
}

provisionEnvironments(repoName, configData);
