---
name: pr-loop
description: Drive one or more work items through a full multi-agent PR pipeline (fetch ticket via Linear MCP or free text → lock → pre-flight → branch → conflict check → implement → gates → PR → 2 independent reviews, one cross-model → fix every nit → re-review → CI → human merge, or opt-in autonomous merge). Requires GitHub remote, the `gh` CLI, the `codex` CLI, and (optionally) the Linear MCP server for ticket ID lookups.
argument-hint: <linear-ticket-id-or-description>
---

<!--
  Derived from /pr-loop by Surabhi Pradhan (MIT License)
  https://github.com/surpradhan/claude-code-skills
  Modified to replace one of the two review subagents with an external,
  cross-model review via the Codex CLI, so the implementation is never
  reviewed solely by agents from the same model family as the author.
-->

# /pr-loop

**Prerequisites:** `git` with worktree support, `gh` CLI authenticated to a
GitHub remote, `codex` CLI installed and authenticated.

Take the work item(s) in `$ARGUMENTS` and drive each one, in order, through
this project's PR pipeline. One PR per item; advance to the next item only
after the current one is merged (or handed off for merge).

## 0. Learn this project's rules first (REQUIRED)

Before doing anything, discover the project's contribution rules and obey
them. Read, in order, whichever exist: a `## PR-loop` section in
`CONTRIBUTING.md`; then `CONTRIBUTING.md` generally; then `CLAUDE.md` /
`AGENTS.md`; then `README`. Extract:

- **commit format** (type-prefix set)
- **local gates** to run before pushing (test command, linter, build)
- **required CI checks** / what "mergeable" means here
- **branch convention**
- **merge authority** — whether agent merge is permitted at all, or a human
  must approve and merge

If the project documents none of this, ask the user to confirm before
starting. Do not guess project policy.

## 1. Per-item pipeline

For each work item — either a Linear ticket ID (e.g. `UKE-9`) or free-text:

0. **Get the ticket content.**
   - If given a Linear ticket ID and the Linear MCP tools are available: fetch
     the issue's title, description, and acceptance criteria directly via
     MCP. Do not ask the user to paste it if MCP can retrieve it.
   - If MCP is unavailable or the fetch fails: ask the user to paste the
     ticket text rather than guessing at its contents.
   - If given free text directly (no ticket ID), use it as-is.
0.5. **Lock the ticket before doing anything else** (Linear tickets only).
   Run:
   ```
   python3 scripts/linear.py lock <TICKET-ID>
   ```
   This is deterministic, script-enforced locking — always run this exact
   script rather than attempting the lock via an MCP mutation call, so the
   guarantee doesn't depend on the model calling the right tool correctly.
   Fails loudly if the ticket is already in progress or done, which is the
   "only one agent per ticket" guarantee. If this command fails or exits
   non-zero, STOP immediately and tell the user; do not proceed with
   implementation. If the work item has no Linear ticket ID, skip this step.
1. **Pre-flight.** If the item is ambiguous about scope, acceptance criteria,
   or approach, STOP and ask the user to clarify before writing any code.
   (If the `grill-me` skill is available and the ticket hasn't already been
   through it, suggest running that first rather than guessing.)
2. **Ground.** Re-read the issue/spec (`gh issue view <n>` if it's a GitHub
   issue; otherwise use the text supplied) and the actual code paths it
   touches before writing anything.
3. **Branch.** Create a fresh git worktree on a meaningfully-named branch off
   the default branch, per the project's convention.
4. **Conflict check.** Before writing code, verify the branch merges cleanly:
   ```
   git fetch origin
   git merge --no-commit --no-ff origin/<default-branch>
   git merge --abort 2>/dev/null || true
   ```
   If conflicts exist, STOP and surface them; do not auto-resolve.
5. **Implement** the change, matching surrounding code and the item's scope.
   Resist scope creep; spin off a follow-up issue for anything out of scope.
   For large changes (>3 files or a design decision): push an early draft PR
   for directional feedback before finishing the implementation.
6. **Local gates.** Run exactly what the project requires. All green before
   pushing.
7. **Push & open a PR.** Use the project's commit format. Reference the issue
   if one exists. Title per the project's commit format.

8. **Two independent reviews — one same-model, one cross-model.**
   Run BOTH of the following, in parallel:

   - **`pr-validator`** (Claude Code subagent, separate context from the
     author): runs the local gates itself and empirically checks that the
     change does what the PR description claims. This is mechanical
     verification, not opinion, so same-model is fine here.

   - **Cross-model review via Codex CLI** (replaces the original
     `pr-code-reviewer` subagent): run the diff through Codex as a genuinely
     separate model, so the review isn't sharing blind spots with the author.
     ```
     git diff origin/<default-branch>...HEAD | codex exec --sandbox read-only \
       "You are reviewing a PR diff for security vulnerabilities, correctness,
        edge cases, performance implications, and maintainability. Be direct
        and specific — cite file and line for every finding. Do not soften
        or hedge findings. List findings as a numbered list; if there are
        none, say so explicitly rather than commenting generally."
     ```
     `codex exec` defaults to a read-only sandbox — it cannot edit files or
     run this repo's code, it only reads the diff and reports findings. If
     the `codex` CLI isn't available, STOP and tell the user rather than
     silently falling back to a same-model reviewer — the whole point of
     this step is the cross-model check.

   Give each reviewer the PR number/diff and the branch worktree path.

9. **Fix every finding — including nits.** Nothing is ignored, from either
   reviewer. For a finding marked "no change needed," either make the
   improvement or record the deliberate decision in code/PR comments.
10. **Re-review.** Re-run BOTH reviewers (the Claude `pr-validator` subagent
    and the Codex cross-review) on the updated PR until both come back clean
    with zero actionable items and no new findings. **Cap: 3 rounds.** If
    items still surface after round 3, PAUSE and ask the user.
11. **CI.** Wait for CI to go green. Retry a failing job once; if it fails
    again, inspect logs before assuming flakiness. If the second failure
    looks environmental, STOP and surface it rather than retrying
    indefinitely.
12. **Merge step — see §2.**
13. **Advance.** Update the local default branch, confirm the merge landed,
    remove stray worktrees. Post a one-line status, then move to the next
    item.

## 2. Merge authority

**Default (safe): stop at hand-off.** Once both reviews are clean and CI is
green, STOP at: *"PR open, CI green, both reviews clean (including
cross-model) — awaiting human review/merge. Once you've merged, run
`python3 scripts/linear.py done <TICKET-ID>` to close out the ticket."*
Report the PR link and gate status. This is the default unless the project's
rules AND the user both explicitly permit otherwise.

**Opt-in: `autonomous-merge`.** Only if the user explicitly requests it AND
the project permits agent merge — spawn a separate `pr-merger` agent (a third
context) that re-verifies everything before squash-merging. The authoring
context never merges its own PR.

## 3. Context separation (always)

author → `pr-validator` (Claude, same-model) + Codex cross-review (external,
different model) → merge agent (opt-in only). The context that wrote the code
never reviews or merges it, and at least one reviewer is never from the same
model family as the author.

## 4. Safety valves — PAUSE and ask the user on

- review still surfacing actionable items after 3 rounds
- design ambiguity the item/project rules don't settle
- a finding you can't confidently resolve
- CI red you can't fix
- the `codex` CLI being unavailable (do not silently skip cross-model review)
- a merge agent refusal, or the project forbidding a requested merge