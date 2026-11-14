# Development Rules

## Conversational Style

- Keep answers short and concise
- No emojis in commits or code
- No fluff or cheerful filler text
- Technical prose only, be direct
- Use concise, clear, simple language. Define unavoidable jargon before using it.
- Explain non-trivial designs and problems as: problem, concrete example or short trace, then solution. State why the solution is necessary and distinguish it from optional complexity.
- Prefer concrete behavior and small illustrations over abstract summaries, dense terminology, or unexplained lists of changes.
- When the user asks a question, answer it first before making edits or running implementation commands.
- When responding to user feedback or an analysis, explicitly say whether you agree or disagree before saying what you changed.

## Project

A static Astro site: a one-page portfolio styled as a terminal (Gruvbox colours, tmux status bar, `neofetch` header). No UI framework, no server adapter, no backend. Requires Node.js 22.12 or newer.

- `src/pages/index.astro`: page markup. Each section is a typed command followed by its output.
- `src/data/cv.ts`: all portfolio content, transcribed by hand from `cv.tex`.
- `src/components/TerminalCommand.astro`: one command prompt line. `src/components/Icon.astro`: build-time SVG icons.
- `src/scripts/terminal-reveal.js`: types `neofetch` on load, then types and reveals the next section on each downward scroll.
- `src/scripts/terminal.js`: background particles, ASCII toroid, status-bar clock.
- `src/styles/global.css`: Tailwind v4 import, palette variables, terminal effects.
- `draft-v3-neofetch.html`: the original design the site was ported from. Reference only; do not edit.
- `src/content.config.ts`, `src/pages/about.astro`, `src/pages/rss.xml.js`, `src/blog/*`: empty placeholders. Ask before filling or deleting them.

## Code Quality

- Read files in full before wide-ranging changes, before editing files you have not fully inspected, and when asked to investigate or audit. Do not rely on search snippets for broad changes.
- No `any` unless absolutely necessary. The project uses `astro/tsconfigs/strict`.
- Inline single-line helpers that have only one call site.
- Check `node_modules` for external API types; don't guess.
- No inline imports (`await import()`, `import("pkg").Type`). Top-level imports only.
- Never remove or downgrade code to fix type errors from outdated deps; upgrade the dep instead.
- Always ask before removing functionality or code that appears intentional.
- Do not preserve backward compatibility unless the user asks for it.

Rules specific to this site:

- Content goes in `src/data/cv.ts`, not in page markup. When CV content changes, update `cv.tex`, `src/data/cv.ts`, and the compiled `public/oleksandr_kovalyk_cv.pdf` together.
- All content must be readable with JavaScript disabled and with `prefers-reduced-motion: reduce`. Any CSS that hides content must be undone by a path that does not depend on the script loading in time. Example of the failure: a class that hides sections until the script runs, combined with a script that only starts when that class is still present, leaves the page static if the script loads late.
- Never intercept or block scrolling. Reveals react to native scroll events.
- Deep links (`#section-…`), browser find, printing, and back/forward navigation must reach all content.
- New sections use `TerminalCommand.astro` for the prompt and carry `data-terminal-section` so the reveal script picks them up.
- No runtime CDN assets. New icons are added as paths in `Icon.astro`; update `LICENSE-ICONS.txt` if the source changes.
- Use the Gruvbox palette already in `global.css` and the markup. Do not add new colours without asking.
- Keep the file list and the accessibility section of `README.md` in sync with behaviour changes.

## Commands

- After code changes (not docs): `npm run check` (full output, no tail). Fix all errors, warnings, and hints.
- `npm run build` runs the check and then writes `dist/`. Use it when built output is needed.
- Known output, not caused by your change: `[content] collections: Invalid input` and a `/rss.xml` route warning. Both come from the empty placeholder files listed above.
- There is no test suite. For changes to scripts or to CSS that hides content, verify in a real browser against the dev server. Cover: a fresh load, a reload from a scrolled position, a slow script load, reduced motion, JavaScript disabled, a `#section-…` deep link, and a mobile width.
- A dev server may already be running on `http://localhost:4321`. Check before starting one, and never stop a server you did not start.
- For ad-hoc scripts, `write` them to a temp file (e.g. `/tmp`), run, edit if needed, remove when done. Don't embed multi-line scripts in `bash` commands. Install throwaway tools (e.g. Playwright) outside the repo, never into `package.json`.
- Never commit unless the user asks.

## Dependency and Install Security

- Treat npm dep and lockfile changes as reviewed code. Pin new or updated direct deps to exact versions. The existing entries in `package.json` use `^` ranges; do not rewrite them unless asked.
- Install with `npm install --ignore-scripts`, or `npm ci --ignore-scripts` for a clean install. Don't run lifecycle scripts unless the user asks.
- If dep metadata changes, refresh the lockfile with `npm install --package-lock-only --ignore-scripts`.
- Ask before adding a dependency. This site has three runtime deps and should stay small.

## Version Control

This is a jj repository colocated with git (`.jj` and `.git` side by side). Use `jj` for every write. Use `git` only to read (`git log`, `git show`, `git diff`).

Agents cannot use jj's interactive diff editor. The recipes below run without a terminal and were checked against jj 0.47.1. If `jj --version` differs a lot, re-test in a scratch repo (`mktemp -d`, `jj git init`) before relying on them.

### Setup

- Run `export JJ_EDITOR=true` at the start of the shell session. Without it, any command that wants a description opens an editor and hangs.
- `JJ_EDITOR=true` accepts whatever description jj proposes, including an empty one. Always pass `-m` so the commit is not left undescribed.

### Never run

- `-i` / `--interactive` or `--tool` on any command.
- `jj diffedit`, `jj arrange`, `jj resolve` (interactive only).
- `jj split` without paths. That form is interactive: it exits 1 with `failed to set up terminal`, or hangs.
- `jj commit` or `jj squash` without paths, `jj restore` without paths, `jj abandon` on a change you did not create. Each one captures or discards other sessions' work.
- `git add`, `git commit`, `git reset`, `git checkout`, `git stash`, `git clean`.
- `jj git push`, unless the user asks. No remote is configured.

### Shared working copy

Several pi sessions may edit this directory at once. jj snapshots every changed file into `@`, so `@` holds all sessions' edits mixed together.

- Commit only files you changed in this session, by explicit path.
- Before committing, run `jj diff --summary` and confirm which files are yours.
- A second workspace, `dev`, lives at `../portfolio.worktrees/dev`. Do not touch its working-copy commit (`dev@`). `jj workspace list` shows both.
- If a rewrite produces a conflict in a file you did not modify, stop and ask the user.

### Committing

Message format: `{feat,fix,docs,chore}[(content,ui,script,build)]: <message>`. Informative and concise. Extra lines are optional.

| You want | Use |
| --- | --- |
| Some files from `@` in their own commit | `jj commit <paths> -m "…"` |
| Hunks that fix up commits already in the stack | `jj absorb <paths>` |
| Specific hunks or lines of a file in a new commit | Narrow, commit, restore (below) |
| A file's changes moved between existing commits | `jj squash --from <rev> --into <rev> <paths>` |

Whole files:

```bash
jj diff --summary src/a.ts src/b.ts
jj commit src/a.ts src/b.ts -m "feat(ui): parser"
```

The named files become `@-` with that message. Every other change stays in the new `@`. A path with no changes does not fail: jj prints `No matching entries` and still creates an empty commit with exit code 0. That is why the `jj diff --summary` check comes first.

`jj commit` does not move bookmarks. If the commit belongs on `main`, run `jj bookmark move main --to @-`.

Hunks that belong to earlier commits:

```bash
jj absorb <paths>
jj op show -p            # review what moved where
```

Each hunk moves into the closest mutable ancestor that last changed those lines. Hunks with no clear owner stay in `@`, so check `jj diff` afterwards.

Specific hunks or lines into a new commit. jj selects by path only, so make the file hold just the hunk you want, commit it, then put the rest back:

```bash
keep=$(mktemp)                      # outside the repo, so jj does not snapshot it
cp path/to/file "$keep"             # 1. save the full desired state
# 2. edit path/to/file so only the hunk for this commit remains;
#    `jj file show -r @- path/to/file` prints the parent's text for the lines to revert
jj diff --git path/to/file          # 3. confirm it shows only that hunk
jj commit path/to/file -m "fix(ui): …"
cp "$keep" path/to/file; rm "$keep" # 4. bring back the other hunks
jj diff --git path/to/file          # 5. confirm they are now the diff of @
```

Commit first, restore second. For several hunk-level commits, repeat steps 2 to 4 with the same `$keep` and remove it after the last one.

Moving a file's changes between existing commits:

```bash
jj squash --from @- --into @-- src/a.ts    # parent -> grandparent
jj squash src/a.ts                         # @ -> parent
```

Descendants are rebased automatically. `Nothing changed.` means that path had no diff in the source revision. When a squash empties the source and both commits have descriptions, jj asks for a combined one: pass `-m "…"`, or `-u` to keep the destination's message.

### Verify after every rewrite

```bash
jj log -r '::@ & ~root()' --no-graph \
  -T 'change_id.short(8) ++ " | " ++ if(empty, "(empty) ", "") ++ description.first_line() ++ "\n"'
jj diff -r <rev> --summary      # which files a commit touches
jj diff -r <rev> --git          # exact hunks
```

- Look for unexpected `(empty)` commits and for commits with no description.
- `description("text")` in a revset is not a substring match. Use `description(substring:"text")`, or use change ids.
- `--ignore-working-copy` skips the snapshot and shows stale state after file edits. Do not use it to verify.

### Rolling back

`jj undo` reverts the last operation, which is often a `snapshot working copy` (the latest file edits) and not the command you meant. Use a checkpoint:

```bash
op=$(jj op log --no-graph --limit 1 -T 'id.short(12)')   # immediately before risky work
# … split / squash / absorb …
jj op restore "$op"                                       # back to the checkpoint, files included
```

`jj op restore` resets all working-copy files to the checkpoint, including edits other sessions made since. Take the checkpoint right before the rewrite and restore right after a failure. If other sessions' files changed in between, ask the user first. Overwritten edits remain reachable through `jj op log`.

## User Override

If the user's instructions conflict with any rule in this document, ask for explicit confirmation before overriding. Only then execute their instructions.
