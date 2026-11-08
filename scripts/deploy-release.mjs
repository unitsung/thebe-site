import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const releaseDir = join(rootDir, "dist", "release");

const isDryRun = process.argv.includes("--dry-run");
const isRollback = process.argv.includes("--rollback");

const deployHost = process.env.DEPLOY_HOST || "thebe.cc";
const deployUser = process.env.DEPLOY_USER || "deploy";
const deployPath = process.env.DEPLOY_PATH || "/var/www/thebe.cc";
const remoteTarget = `${deployUser}@${deployHost}`;

assert.ok(existsSync(releaseDir), "Release directory dist/release must exist before deployment.");
const releaseFiles = readdirSync(releaseDir);
assert.ok(releaseFiles.length > 0, "Release directory dist/release cannot be empty.");

let commit = "unknown";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: rootDir, encoding: "utf8" }).trim();
} catch {
  // Not a fatal error if git is not initialized
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const releaseId = `${timestamp}-${commit}`;
const remoteReleasePath = `${deployPath}/releases/${releaseId}`;
const currentSymlink = `${deployPath}/current`;

console.log(`=== Thebe Site Deployment ===`);
console.log(`Host: ${remoteTarget}`);
console.log(`Base path: ${deployPath}`);
console.log(`Release ID: ${releaseId}`);
console.log(`Mode: ${isDryRun ? "DRY-RUN (simulation only)" : "LIVE"}`);

const commands = [
  `# 1. Create target release directory`,
  `ssh ${remoteTarget} "mkdir -p ${remoteReleasePath}"`,
  `# 2. Synchronize release assets`,
  `rsync -avz --delete ${releaseDir}/ ${remoteTarget}:${remoteReleasePath}/`,
  `# 3. Atomically switch current symlink pointer`,
  `ssh ${remoteTarget} "ln -sfn ${remoteReleasePath} ${deployPath}/current_tmp && mv -Tf ${deployPath}/current_tmp ${currentSymlink}"`,
  `# 4. Prune older releases (keep 5 newest)`,
  `ssh ${remoteTarget} "cd ${deployPath}/releases && ls -1dt * | tail -n +6 | xargs -r rm -rf"`,
];

if (isDryRun) {
  console.log("\nPlanned execution steps:");
  for (const cmd of commands) {
    console.log(`  ${cmd}`);
  }
  console.log("\n[Dry-run simulation successful. No remote changes made.]");
  process.exit(0);
}

if (!process.env.DEPLOY_HOST) {
  console.error("Error: DEPLOY_HOST is required for live deployment.");
  process.exit(1);
}

try {
  console.log("Executing deployment...");
  execSync(`ssh ${remoteTarget} "mkdir -p ${remoteReleasePath}"`, { stdio: "inherit" });
  execSync(`rsync -avz --delete ${releaseDir}/ ${remoteTarget}:${remoteReleasePath}/`, { stdio: "inherit" });
  execSync(
    `ssh ${remoteTarget} "ln -sfn ${remoteReleasePath} ${deployPath}/current_tmp && mv -Tf ${deployPath}/current_tmp ${currentSymlink}"`,
    { stdio: "inherit" },
  );
  execSync(`ssh ${remoteTarget} "cd ${deployPath}/releases && ls -1dt * | tail -n +6 | xargs -r rm -rf"`, {
    stdio: "inherit",
  });
  console.log("Deployment completed successfully.");
} catch (error) {
  console.error("Deployment failed:", error.message);
  process.exit(1);
}
