# GitHub Action for dotnet-format

[![CI Workflow Status](https://github.com/jfversluis/dotnet-format/workflows/CI/badge.svg)](https://github.com/jfversluis/dotnet-format/actions?query=workflow%3ACI)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jfversluis/dotnet-format)](https://dependabot.com)

Run [dotnet-format](https://github.com/dotnet/format) as part of your workflow to report formatting errors or auto fix violations as part of your pull request workflow.

## Usage

Running on `pull_request`.

```yml
name: Format check on pull request
on: pull_request
jobs:
  dotnet-format:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2

      - name: Add dotnet-format problem matcher
        uses: xt0rted/dotnet-format-problem-matcher@v1

      - name: Restore dotnet tools
        uses: xt0rted/dotnet-tool-restore@v1

      - name: Run dotnet format
        id: format
        uses: jfversluis/dotnet-format@v1.0.4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          action: "fix"
          only-changed-files: false
          folder: "src"
          exclude: "exclude_file,exclude_folder"

```

## Options

### Required

Name | Allowed values | Description
-- | -- | --
`repo-token` | `GITHUB_TOKEN` or a custom value | The token used to call the GitHub api.

### Optional

Name | Allowed values | Description
-- | -- | --
`action` | `check` (default), `fix` | The primary action `dotnet format` should perform. Check doesn't make changes to your file, fix will do the actual formatting.
`only-changed-files` | `true`, `false` (default) | Only changed files in the current pull request should be formatted. Only works when the trigger is a pull request.
`fail-fast` | `true` (default), `false` | The job should fail if there's a formatting error. Only used with the `check` action.
`workspace` | `.` | The solution or project file to operate on. In case you want to process all files in a certain folder, set the root folder here and specify the `workspaceIsFolder` option.
`workspaceIsFolder` | `.` | Specifies if the value in `workspace` has to be treated as a simple folder. If true, set `workspace` to the root folder you want to process.
`include` | `.` | The files to include, delimited by space. Cannot be used together with the `workspace` option.
`exclude` | `.` | Space delimited list of files and/or folders to ignore.
`logLevel` | `q[uiet]`, `m[inimal]`, `n[ormal]`, `d[etailed]`,  `diag[nostic]` | Sets the logging verbosity of the dotnet format process

## Outputs

Name | Description
-- | --
`has-changes` | If any files were found to have violations or had fixes applied. Will be a string value of `true` or `false`.

# Building from source

## Generating `dist/index.js`
`npm run release`

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
