import { getInput, setOutput } from "@actions/core";

import {format, FormatOptions} from "./dotnet";

function buildOptions(): FormatOptions {
  const onlyChangedFiles = getInput("only-changed-files") === "true";
  const include: string = getInput("include");
  const workspace: string = getInput("workspace");
  const workspaceIsFolder = getInput("workspaceIsFolder") === "true";
  const exclude: string = getInput("exclude");
  const logLevel: string = getInput("log-level");

  const formatOptions: FormatOptions = {
    onlyChangedFiles,
  };

  if (include !== undefined && include != "") {
    formatOptions.include = include;
  } else if (workspace !== undefined && workspace != "") {
    formatOptions.workspace = workspace;
  }

  if (exclude !== undefined && exclude != "") {
    formatOptions.exclude = exclude;
  }

  if (logLevel !== undefined && logLevel != "") {
    formatOptions.logLevel = logLevel;
  }
  
  return formatOptions;
}

export async function check(): Promise<void> {
  const failFast = getInput("fail-fast") === "true";

  const formatOptions = buildOptions();
  formatOptions.dryRun = true;

  const result = await format(formatOptions);

  setOutput("has-changes", result.toString());

  // fail fast will cause the workflow to stop on this job
  if (result && failFast) {
    throw Error("Formatting issues found");
  }
}

export async function fix(): Promise<void> {
  const formatOptions = buildOptions();
  formatOptions.dryRun = false;

  const result = await format(formatOptions);

  setOutput("has-changes", result.toString());
}
