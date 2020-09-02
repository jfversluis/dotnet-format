import { debug, info, warning } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { which } from "@actions/io";

import { getPullRequestFiles } from "./files";

import type { ExecOptions } from "@actions/exec/lib/interfaces";

export interface FormatOptions {
  onlyChangedFiles: boolean;
  dryRun?: boolean;
  workspace?: string;
  include?: string;
  exclude?: string;
  logLevel?: string;
}

function formatOnlyChangedFiles(onlyChangedFiles: boolean): boolean {
  if (onlyChangedFiles) {
    if (context.eventName === "issue_comment" || context.eventName === "pull_request") {
      return true;
    }

    warning("Formatting only changed files is available on the issue_comment and pull_request events only");

    return false;
  }

  return false;
}

export async function format(options: FormatOptions): Promise<boolean> {
  const execOptions: ExecOptions = {
    ignoreReturnCode: true,
    windowsVerbatimArguments: true
  };

  const dotnetFormatOptions = ["format"];

  if (options.workspace !== undefined && options.workspace != "") {
    dotnetFormatOptions.push(options.workspace);
  }

  if (options.dryRun) {
    dotnetFormatOptions.push("--check");
  }

  if (formatOnlyChangedFiles(options.onlyChangedFiles)) {
    const filesToCheck = await getPullRequestFiles();

    info(`Checking ${filesToCheck.length} files`);

    // if there weren't any files to check then we need to bail
    if (!filesToCheck.length) {
      debug("No files found for formatting");
      return false;
    }
    dotnetFormatOptions.push("-f");

    dotnetFormatOptions.push("--include", filesToCheck.join(" "));
  }

  if (options.exclude !== undefined && options.exclude != "") {
    dotnetFormatOptions.push("--exclude", options.exclude);
  }

  if (options.logLevel !== undefined && options.logLevel != "") {
    dotnetFormatOptions.push("--verbosity", options.logLevel);
  }

  const dotnetPath: string = await which("dotnet", true);
  // const dotnetCheckResult = await exec(`"${dotnetPath}"`, ["format", "--check", options.workspace ?? ""], execOptions);

  // info(`dotnet format check result ${dotnetCheckResult}`);

  // if ((dotnetCheckResult === 0)) {
  //   info("No files that need formatting, exiting");

  //   return false;
  // }

  const dotnetResult = await exec(`"${dotnetPath}"`, dotnetFormatOptions, execOptions);
  
  info(`dotnet format return code ${dotnetResult}`);
  return !!dotnetResult;
  //return dotnetResult == 0;
}
