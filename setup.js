#!/usr/bin/env node

// setup.js — Initial setup for Whitepapers-Template
//
// Run this once after cloning. The script is safe to re-run, but will
// skip itself once setup is complete.
//
// Usage:
//   node setup.js

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_NAME = "Whitepapers-Template";
const NEEDS_GHOSTSCRIPT = true;
const SETUP_MARKER = ".setup-complete";
const MIN_NODE_MAJOR = 18; // Puppeteer requires Node 18+

// ── ANSI colours ────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};
const supportsColour = process.stdout.isTTY;
const paint = (col, msg) => (supportsColour ? col + msg + c.reset : msg);
const log = (msg) => process.stdout.write(msg + "\n");
const ok = (msg) => log("  " + paint(c.green, "✓ ") + msg);
const warn = (msg) => log("  " + paint(c.yellow, "⚠ ") + msg);
const fail = (msg) => {
  log("  " + paint(c.red, "✗ ") + msg);
  process.exit(1);
};
const banner = (title) => {
  const line = "═".repeat(53);
  log("");
  log(paint(c.bold + c.cyan, line));
  log(paint(c.bold + c.cyan, "   " + title));
  log(paint(c.bold + c.cyan, line));
};
const step = (n, total, title) => {
  log("");
  log(paint(c.bold, `Step ${n} of ${total} — ${title}`));
};

// ── Helpers ─────────────────────────────────────────────────
function commandExists(cmd) {
  try {
    execSync(
      process.platform === "win32" ? `where ${cmd}` : `command -v ${cmd}`,
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

function findGhostscript() {
  const candidates = ["/opt/homebrew/bin/gs", "/usr/local/bin/gs"];
  if (commandExists("gs")) return "gs";
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function nodeMajorVersion() {
  return parseInt(process.versions.node.split(".")[0], 10);
}

// Only pause for a keypress if running in an interactive terminal.
// When run via Claude Code or any other non-TTY context, just proceed.
function ask(prompt) {
  if (!process.stdin.isTTY) {
    log(paint(c.dim, prompt + "(non-interactive — continuing automatically)"));
    return Promise.resolve("");
  }
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      resolve(data.toString().trim());
    });
  });
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", ...opts });
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  // Skip if already done
  if (fs.existsSync(SETUP_MARKER)) {
    log("");
    log(paint(c.dim, "Setup has already been completed for this repo."));
    log(
      paint(c.dim, `If you need to run it again, delete ${SETUP_MARKER} first.`)
    );
    log("");
    process.exit(0);
  }

  banner(`Setting up: ${REPO_NAME}`);
  log("");
  log("Welcome! This script walks you through everything you need");
  log("to do before you can start creating materials.");
  log("");
  log("It takes about 2 minutes. You only need to run it once.");
  log("");
  const totalSteps = NEEDS_GHOSTSCRIPT ? 5 : 4;
  log("Here's what we'll do:");
  log(`  1. Check prerequisites (Node version, git)`);
  log(`  2. Pull in the shared brand resources (Brand-Shared submodule)`);
  log(`  3. Install the renderer dependencies (downloads ~170MB of Chromium)`);
  if (NEEDS_GHOSTSCRIPT) {
    log(`  4. Check that Ghostscript is installed (used to compress PDFs)`);
    log(`  5. Check whether your brand has been filled in yet`);
  } else {
    log(`  4. Check whether your brand has been filled in yet`);
  }
  log("");
  await ask(paint(c.dim, "Press Enter to continue, or Ctrl+C to cancel… "));

  let n = 1;

  // ── Step 1: Prerequisites ─────────────────────────────────
  step(n++, totalSteps, "Checking prerequisites");

  const nodeMajor = nodeMajorVersion();
  if (nodeMajor < MIN_NODE_MAJOR) {
    fail(
      `Node.js ${process.versions.node} is too old. Need v${MIN_NODE_MAJOR}+. Get the LTS version from https://nodejs.org/, then re-run this script.`
    );
  }
  ok(`Node.js v${process.versions.node}`);

  if (!commandExists("npm")) {
    fail(
      "npm is missing — it normally ships with Node.js. Re-install Node from https://nodejs.org/."
    );
  }
  ok("npm is available");

  if (!commandExists("git")) {
    fail(
      "git is not installed. Install it from https://git-scm.com/downloads, then re-run this script."
    );
  }
  ok("git is available");

  // ── Step 2: Submodule init ─────────────────────────────────
  step(n++, totalSteps, "Pulling in shared brand resources");
  log("  This pulls down the Brand-Shared repo into brand-shared/.");
  log("  Brand-Shared is where your colours, fonts, and logos live.");
  log("");
  log(paint(c.dim, "  $ git submodule update --init --recursive"));
  try {
    run("git submodule update --init --recursive");
  } catch {
    log("");
    log(paint(c.red, "  Could not pull Brand-Shared."));
    log("");
    log("  This usually means one of:");
    log(
      "    • You don't have access to the Brand-Shared repo (private repo, no auth)"
    );
    log("    • Your network blocked the request (corporate proxy, no internet)");
    log("    • The submodule URL points somewhere that doesn't exist");
    log("");
    log("  To fix:");
    log("    1. Check the URL in .gitmodules");
    log(
      "    2. Either get access to that repo, or fork it to your own GitHub"
    );
    log("       account and update .gitmodules to point to your fork");
    log("    3. Then re-run this script");
    process.exit(1);
  }
  if (
    !fs.existsSync(
      path.join("brand-shared", "references", "brand-guidelines.md")
    )
  ) {
    fail(
      "brand-shared/ is empty after init. Try running `git submodule update --init --recursive` manually and read any error messages."
    );
  }
  ok("Brand-Shared is now in brand-shared/.");

  // ── Step 3: npm install ───────────────────────────────────
  step(n++, totalSteps, "Installing the renderer");
  log("  This installs Puppeteer (which downloads its own Chromium browser)");
  log("  plus a small helper or two. The Chromium download is about 170MB —");
  log(
    "  on a slow connection or behind a corporate proxy, this step can take"
  );
  log("  several minutes. Don't worry if it looks stuck on \"Downloading\".");
  log("");
  log(paint(c.dim, "  $ cd server && npm install"));
  try {
    run("npm install", { cwd: "server" });
  } catch {
    fail(
      "npm install failed. Scroll up to read the error from npm. Common fixes: check your internet connection; if a permissions error, do not run with sudo; if behind a corporate proxy, set HTTPS_PROXY in your environment."
    );
  }
  ok("Renderer dependencies installed.");

  // ── Step 4: Ghostscript check (if required) ───────────────
  if (NEEDS_GHOSTSCRIPT) {
    step(n++, totalSteps, "Checking for Ghostscript");
    log("  Ghostscript compresses your PDFs after they're rendered,");
    log("  so the final files aren't enormous. It's a one-time install.");
    log("");
    const gsPath = findGhostscript();
    if (!gsPath) {
      log("");
      warn("Ghostscript is not installed yet.");
      log("");
      log("  Install it:");
      log(paint(c.dim, "    macOS:    ") + "brew install ghostscript");
      log(paint(c.dim, "    Linux:    ") + "sudo apt install ghostscript");
      log(
        paint(c.dim, "    Windows:  ") +
          "download from https://www.ghostscript.com/"
      );
      log("");
      log("  After installing, re-run this script:");
      log(paint(c.dim, "    $ node setup.js"));
      log("");
      log(
        "  (Setup hasn't been marked complete, so re-running picks up here.)"
      );
      process.exit(1);
    }
    ok(`Ghostscript found at: ${gsPath}`);
  }

  // ── Final step: Brand content check ───────────────────────
  step(n++, totalSteps, "Checking your brand content");
  const guidelinesPath = path.join(
    "brand-shared",
    "references",
    "brand-guidelines.md"
  );
  let brandPopulated = true;
  if (fs.existsSync(guidelinesPath)) {
    const content = fs.readFileSync(guidelinesPath, "utf8");
    if (content.includes("TODO:") && content.includes("Replace this file")) {
      brandPopulated = false;
    }
  }

  if (brandPopulated) {
    ok("Brand-Shared has been populated with your brand content.");
  } else {
    log("");
    warn("Brand-Shared still contains placeholder TODO content.");
    log("");
    log("  Before creating any materials, you'll need to populate the");
    log("  Brand-Shared repo with your actual brand:");
    log("");
    log("    " + paint(c.bold, "1.") + " Open the Brand-Shared repo:");
    log("       (URL in .gitmodules — usually https://github.com/AskerJ-pers/Brand-Shared)");
    log("");
    log("    " + paint(c.bold, "2.") + " Replace the placeholder content in:");
    log("       • references/brand-guidelines.md");
    log("       • references/tone-of-voice.md");
    log("       • tokens.css");
    log("       • tokens.json");
    log("       • brand/  (your logo SVGs)");
    log("");
    log("    " + paint(c.bold, "3.") + " Commit and push your changes there.");
    log("");
    log(
      "    " +
        paint(c.bold, "4.") +
        " Come back to this repo and pull the latest:"
    );
    log(paint(c.dim, "       $ git submodule update --remote brand-shared"));
    log(
      paint(
        c.dim,
        "       $ git add brand-shared && git commit -m 'Update brand-shared'"
      )
    );
    log("");
    log(
      "  You can do this later — but materials made before populating the"
    );
    log("  brand will use placeholder colours and copy.");
  }

  // ── Mark complete ──────────────────────────────────────────
  fs.writeFileSync(
    SETUP_MARKER,
    "Setup completed at " + new Date().toISOString() + "\n"
  );

  // ── Done ────────────────────────────────────────────────────
  banner("Setup complete!");
  log("");
  log("You're ready to start creating materials.");
  log("");
  log(paint(c.bold, "Next steps:"));
  log("  • Open " + paint(c.cyan, "CLAUDE.md") + " to read the workflow.");
  log("  • Open Claude Code in this repo and ask it to create");
  log("    your first material.");
  log("");
  log(
    paint(
      c.dim,
      `(This script won't run again unless you delete ${SETUP_MARKER}.)`
    )
  );
  log("");
  process.exit(0);
}

main().catch((err) => {
  log("");
  log(paint(c.red, "Setup failed: " + (err.stack || err.message || err)));
  log("");
  process.exit(1);
});
