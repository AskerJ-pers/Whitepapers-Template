# Getting started — Whitepapers-Template

A step-by-step guide for first-time users. If you've never used GitHub or Claude Code before, this walks through everything from scratch.

If you're already set up with GitHub, Node.js, Ghostscript, and Claude Code, just run `node setup.js` from the repo root — skip to step 9.

---

## 1. Create a GitHub account

GitHub is where the templates and your finished materials are stored.

1. Go to [github.com/signup](https://github.com/signup)
2. Sign up using your work email address
3. Verify your email when prompted

---

## 2. Install GitHub Desktop

GitHub Desktop downloads and syncs files without needing the command line for everyday work.

### On Mac
1. Go to [desktop.github.com](https://desktop.github.com/)
2. Click **Download for macOS**
3. Open the downloaded `.dmg` file and drag **GitHub Desktop** to your Applications folder
4. Open GitHub Desktop and sign in

### On Windows
1. Go to [desktop.github.com](https://desktop.github.com/)
2. Click **Download for Windows**
3. Run the installer and sign in

---

## 3. Get access to the repo

Before you can download the materials, you need to be granted access.

1. Send your GitHub username to your team administrator
2. Wait for confirmation that you have been added
3. Accept the GitHub email invitation

---

## 4. Clone the repo

"Cloning" downloads a copy of the materials to your computer.

1. Open GitHub Desktop
2. Click **File > Clone Repository**
3. Click the **URL** tab
4. Paste the repo URL
5. Choose where to save it and click **Clone**

GitHub Desktop pulls down the brand resources automatically as part of cloning.

---

## 5. Install Node.js

Node.js is needed to render your materials and to run the setup script.

### On Mac
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version (the larger button on the left)
3. Open the `.pkg` file and follow the installer steps
4. To check it worked: open **Terminal**, type `node --version`, press Enter — you should see a version number like `v20.11.0`

### On Windows
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version
3. Run the installer — make sure **"Add to PATH"** is checked
4. To check it worked: open **Command Prompt**, type `node --version`, press Enter

---

## 6. Install Ghostscript

Ghostscript compresses your PDFs after rendering so the files aren't huge.

### On Mac
1. Open **Terminal**
2. If you don't already have Homebrew, install it from [brew.sh](https://brew.sh/) (paste the command shown there into Terminal)
3. Run: `brew install ghostscript`

### On Linux
1. Open a terminal
2. Run: `sudo apt install ghostscript`

### On Windows
1. Go to [ghostscript.com/releases/gsdnld.html](https://www.ghostscript.com/releases/gsdnld.html)
2. Download the **AGPL Release** for Windows (64-bit)
3. Run the installer

---

## 7. Install the Claude desktop app

1. Go to [claude.ai/download](https://claude.ai/download)
2. Download and install the app for your platform
3. Open Claude and sign in with your Anthropic account

---

## 8. Install the Claude in Chrome extension

The Claude in Chrome extension lets Claude preview materials in your browser as it builds them.

1. Go to the [Chrome Web Store listing](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn)
2. Click **Add to Chrome**, then **Add extension**
3. Click the Claude icon in your browser toolbar and sign in with the same Anthropic account

> **Browser note:** This system saves your edits using a feature only supported in Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Arc). Firefox and Safari won't be able to save edits made in the browser. Use Chrome or Edge for editing.

---

## 9. Open Claude Code and run the setup script

1. Open the Claude desktop app
2. Click the **Code** tab
3. Select the repo folder when prompted (the folder GitHub Desktop downloaded in step 4)

When you first open the repo and ask Claude to do anything, it will detect that the repo hasn't been set up yet and run `node setup.js` for you. The setup script:

- Checks your prerequisites (Node version, git)
- Pulls in the brand resources (Brand-Shared)
- Installs the renderer (Puppeteer + ~170MB Chromium download — be patient on slow connections)
- Verifies Ghostscript is installed
- Tells you whether your brand has been filled in yet

It only runs once. After that, Claude will go straight to whatever you ask for.

---

## 10. Working with materials

Once setup is done, you can ask Claude to:

**Create a new whitepaper:**
- "Create a 10-page whitepaper on [topic] with intro, three body sections, conclusion, and references"
- "Build a research report covering [topic] with two data-heavy spreads"

**Edit an existing whitepaper:**
- "Add a pull quote and sidebar callout to section 2 of [whitepaper-name]"
- "Update the references page with these citations: [...]"
- "Insert a new section about [topic] between sections 2 and 3"

**Generate a PDF:**
- "Render [whitepaper-name] to PDF"

---

## 11. Syncing your changes

After creating or editing materials:

1. Open **GitHub Desktop**
2. Type a short summary in the **Summary** box (e.g. "Created bank pitch deck")
3. Click **Commit to main**
4. Click **Push origin** to share your changes with the team

To get others' latest changes, click **Fetch origin** then **Pull origin**.

---

## Troubleshooting

**"Setup failed at the Brand-Shared step"** — usually means you don't have access to the Brand-Shared repo, or your network blocked the request. Check the URL in `.gitmodules` and either get access or fork it to your own GitHub account, then update the URL.

**"npm install is stuck on Downloading"** — Puppeteer is downloading ~170MB of Chromium. On slow connections this can take 5+ minutes. It's not stuck — just wait.

**"Ghostscript not found"** — the setup script will print install commands when this happens. Re-run setup after installing.

**"My edits aren't saving when I press Cmd+Alt+S"** — make sure you're using Google Chrome, Microsoft Edge, Brave, or Arc. Firefox and Safari don't support the save feature this system uses.

**"Brand-Shared still has TODO content"** — the brand assets (colours, fonts, logos) haven't been filled in yet. Materials made before populating Brand-Shared will use placeholder colours and copy. Ask your administrator about populating Brand-Shared.
