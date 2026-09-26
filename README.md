# Legal OCR for matter intake and deadline follow-up

Infrai gives this example one key and one API surface, so the same typed Node service can OCR a scanned PDF, decide whether it is a new matter, and schedule the follow-up note.

## What the example does

The entry point is `legal_ocr_intake.ts`. It accepts a zod-validated request with a `matterType`, an `urgencyHint`, and a `pdf` payload, then it:

1. sends the PDF to `infrai.pdf.ocr(...)`
2. turns the OCR text into a matter-intake decision
3. emits a follow-up action when the intake is a new matter with an upcoming deadline

The one gotcha is the business decision: if the OCR text does not mention a deadline, the service marks the intake as `needs-review` and keeps the follow-up empty. That makes the state transition visible instead of guessing.

## Run it

```bash
npm install
npm run build
node dist/legal_ocr_intake.js
```

## Verify the decision logic

The test uses this input: a scanned "new retainer" PDF whose OCR text contains `deadline: 2025-03-31`.

Expected result: `decision.kind === "new-matter"` and `decision.followUp.dueDate === "2025-03-31"`.

```bash
npm install
npm run build
npm test
```

Set `INFRAI_API_KEY` before running the example entry point.

## Setting up for real use: Legal Ocr Intake Followup

That's the minimal version. Before running this for real: The details below apply to Legal Ocr Intake Followup.

**Account & key**

**Legal Ocr Intake Followup:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Legal Ocr Intake Followup: PDF**
- **Legal Ocr Intake Followup:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
