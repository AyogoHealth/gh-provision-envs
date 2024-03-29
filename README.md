# GitHub Environment Provisioning

A GitHub CLI command to provision environments with secrets and variables from a configuration file.

## Requirements

* The [GitHub CLI](https://cli.github.com/) tool
* Administrative permissions on the GitHub repositories you want to run this on
* NodeJS 18.x or newer

## Usage

You can install this as an extension to the `gh` CLI tool. At its simplest, you give it a JSON config file and a repository name:

```
gh extension install AyogoHealth/gh-provision-envs
gh provision-envs -c config.json -R myuser/myrepo
```

### Disclaimers

* This will **overwrite** variable and secret values if they already exist!
* This is a bit of a hack, cobbled together by spawning other `gh` commands
* If your secret/variable values contain double quotes, you'll maybe have a bad time...
* If you try to break it, you almost definitely will

## Config File Format

The config file must be a valid JSON file, consisting of an object with an `environments` key that contains the environments you would like to provision.

### Example

```json
{
  "environments": {
    "staging": {
      "variables": [
        {
          "name": "HOSTNAME",
          "value": "staging.example.com"
        }
      ],
      "secrets": [
        {
          "name": "DEPLOY_KEY_PASSWORD",
          "value": "MySecretPassword1"
        }
      ]
    },
    "production": {
      "variables": [
        {
          "name": "HOSTNAME",
          "value": "example.com"
        }
      ],
      "secrets": [
        {
          "name": "DEPLOY_KEY_PASSWORD",
          "value": "MySecretPassword2"
        },
        {
          "name": "SECRET_PRODUCTION_VALUE",
          "value": "ThisIsASecret"
        }
      ]
    }
  }
}
```

## Contributing

Contributions of bug reports, feature requests, and pull requests are greatly
appreciated!

Please note that this project is released with a [Contributor Code of
Conduct](https://github.com/AyogoHealth/gh-provision-envs/blob/main/CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.


## Licence

Released under the [MIT Licence](LICENCE).

Copyright © 2023 Ayogo Health Inc.
