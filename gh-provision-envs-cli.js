#!/usr/bin/env node
/*! Copyright 2023 Ayogo Health Inc. */

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { provisionEnvironments } from "./index.js";

function bold(text) {
  if (process.stdout?.hasColors?.()) {
    return `\u001b[1m${text}\u001b[22m`;
  } else {
    return text;
  }
}

function usage() {
  console.log("Provision environments with secrets and variables from a configuration file.");
  console.log("");
  console.log(bold("USAGE"));
  console.log("  gh provision-envs [flags]");
  console.log("");
  console.log(bold("FLAGS"));
  console.log("  -R, --repo [HOST/]OWNER/REPO   GitHub repository to provision");
  console.log("  -c, --config string            Path to configuration JSON file");
  console.log("      --help                     Show help for command");
  console.log("");
  console.log(bold("LEARN MORE"));
  console.log("  See configuration examples at https://github.com/AyogoHealth/gh-provision-envs");
}

const args = parseArgs({ options: {
  "repo": {
    type: "string",
    short: "R"
  },
  "config": {
    type: "string",
    short: "c"
  },
  "help": {
    type: "boolean",
    short: "h"
  }
}});

if ("help" in args.values) {
  usage();
  process.exit(0);
}

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
