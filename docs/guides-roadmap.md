# Interactive guides: one per essay category

Each category gets one native guide built on the guide kit (`components/guide/kit.tsx`). Rules that apply to all of them:

1. **No source, no figure.** `Stat` and `Cite` take a source id typed against the guide's registry. Unknown ids fail the build.
2. **Every source is opened and checked before it is added.** Drafts from other models are leads, not sources (see "Corrections" below).
3. **Inputs are labeled as inputs.** Calculator defaults are examples, never presented as market data. Formulas are shown.
4. **Framework is labeled as framework.** When a tool encodes an Operator argument rather than established practice, the note under it says so.
5. **Four tools maximum per guide,** each answering one question a reader actually has.

| Category | Guide | Essays it serves | Ship by | Status |
|---|---|---|---|---|
| Climate infrastructure | The Fence Line | Own What You Host, Truth Is Infrastructure | Nov 9, 2026 | Built |
| Digital assets | Who Verifies? | Custody Is a Verification Problem | **Mon Nov 23, 2026** | Spec below |
| Legal engineering | The Contract Debugger | Legal Engineering Is Systems Design, The Law Firm AI Problem | **Mon Dec 7, 2026** | Spec below |
| AI systems | The Authority Ledger | Your Agent Can Sign, AI Agents Need a Legal Body | **Fri Dec 18, 2026** | Spec below |

Order rule: a guide tied to a live deadline ships first. The SEC custody proposal closes for comment on **December 7, 2026**, so Who Verifies? goes out two weeks ahead of it.

---

## Legal engineering: The Contract Debugger

Thesis from the essays: a contract is a state machine written in prose, and prose hides the same defects software engineers test for. The guide lets a reader find those defects in structures they recognize.

### Tool 1: State machine inspector (lead tool)
- Pick a preset (credit agreement, 50/50 joint venture, distribution freeze clause, SAFE conversion) or add your own states and transitions.
- Renders the machine as a diagram and runs four checks, each with a plain-English fix:
  - **Orphaned state:** a non-terminal state with no way out (a penalty or freeze with no cure path). Fix: add a cure or reinstatement transition.
  - **Unreachable state:** defined but no event leads to it. Fix: delete it or add the trigger.
  - **Non-deterministic transition:** one event leads to two states (cross-default and force majeure firing together). Fix: add a precedence rule.
  - **Deadlock:** progress needs a vote that can split evenly with no tie-break. Fix: buy-sell, shotgun, or a named tie-breaker.
- Logic is deterministic and checkable, so it needs no citations. The deadlock card cites the statutory fallbacks (to verify: DGCL § 226 custodian for deadlocked corporations; Delaware LLC Act § 18-802 judicial dissolution).

### Tool 2: Waterfall invariant checker
- Build a capital stack: senior debt, mezzanine, preferred classes (1× or 2× preference, participating or not, caps), common.
- Slide the exit value. See every class's payout, who absorbs the loss, and where preference overhang wipes out common.
- Proves the safety invariant on screen: total distributions never exceed exit value. Pure math; inputs only.

### Tool 3: Control path simulator
- Founder and investor ownership across financing rounds, with an optional high-vote founder class.
- Set a control threshold and a milestone date; the tool flags the first round that breaks the control invariant.
- Cites DGCL § 151 for classes with different voting powers (already verified in The Fence Line).

### Tool 4: AI supervision record (from The Law Firm AI Problem)
- A reviewer logs one AI-assisted work product: task, risk tier, who reviewed, what was checked (citations run through a citator, client data handling, fee treatment).
- Output: a supervision record mapped to the duties ABA Formal Opinion 512 names (competence, confidentiality, communication, supervision, fees), exportable as text.
- Sources already verified: ABA Formal Opinion 512, Model Rule 1.1 Comment 8, Model Rule 5.3, Mata v. Avianca, Shepard's history. To verify: a current count of court decisions involving AI-fabricated citations from a maintained public database.

### Optional fifth (only if it beats one above): billable hour vs. fixed fee
Hours before and after AI, rate, and a fee model; shows when efficiency costs the firm revenue. Inputs only.

### From the Nov 9 draft: keep, cut, verify
- **Keep:** the defect table (orphaned state, non-deterministic transition, deadlock, race condition) and the three invariants (safety, liveness, control). Both match the essay.
- **Cut:** the formal notation block. The tool should show the machine, not the math.
- **Verify before use:** the named DAO wrappers (Swiss association, Cayman foundation company, Marshall Islands DAO LLC). Each needs a statute or regulator source.

---

## Digital assets: Who Verifies?

1. **Custody path finder.** Adviser or fund, asset type, custodian available or not: shows which path the SEC's October 2026 proposal would allow (qualified custodian, state trust company, or adviser self-custody) and the conditions attached. Ends at the December 7 comment deadline with a link to file. Sources verified: SEC release S7-2026-35; Goodwin summary of conditions.
2. **Solvency simulator.** Reserves vs. liabilities with a small Merkle-sum tree, so a reader sees why reserves alone prove nothing. Sources: SEC v. Bankman-Fried (verified); a primary technical write-up on proof of liabilities (to verify).
3. **Attestation gap.** Redemptions flowing between monthly reserve reports. Source: GENIUS Act text (verified).
4. **Token vs. right.** Operating-agreement transfer restrictions against on-chain transferability; flags tokens that move where the right cannot.

## AI systems: The Authority Ledger

1. **Grant builder.** Scope, budget, counterparties, expiry for one agent; test proposed actions against it and get an authorized / not authorized record.
2. **Who is bound.** The same agent action under three structures (no entity, attributed to you, Series LLC) and where liability lands. Sources verified: UETA, Restatement position via Quinn Emanuel, Delaware LLC Act series provision, Wyoming DAO LLC act.
3. **Port Measured, Not Ranked** from its standalone page into the kit, so all guides share one look and one source standard.

---

## Corrections to the Nov 9 Own What You Host draft
Recorded so they don't come back:
- Maryland residential noise limits are 65 dBA day / 55 dBA night (COMAR 26.02.03.02 Table 1), not 55 / 45 to 50.
- Prince George's acted by council resolution in July 2026 (up to two years, or until legislation). The bill numbers in the draft could not be found.
- Servers do not qualify for the § 48 investment tax credit, which covers energy property.
- A private contract cannot freeze a county's permit processing. The enforceable version is a consent right in the company's own charter (Fence Line, covenant section 6).
- "6 to 12 month fast-track," carrying-cost rates, and cost-of-capital ranges had no source; they appear only as labeled user inputs.
- The Chandler/Mesa evaporative-cooling claim and the "Stanford e-corporation" attribution are unverified and unused.
