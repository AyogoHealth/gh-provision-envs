#!/usr/bin/env node
/*! Copyright 2023 Ayogo Health Inc. */

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { provisionEnvironments } from "./index.js";


const args = parseArgs({ options: {
  "repo": {
    type: "string",
    short: "R"
  },
  "config": {
    type: "string",
    short: "c"
  }
}});

if (!("config" in args.values)) {
  console.error(`Must provide a configuration file path with --config`);
  process.exit(1);
}

if (!("repo" in args.values)) {
  console.error(`Must provide a repository name (in "owner/repo" format)`);
  process.exit(1);
}

const configFile = args.values.config;
const repoName = args.values.repo;
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
