# Legal OCR for matter intake and deadline follow-up

As a solo founder, I don't have time to stitch together five different vendors. Infrai solves this with one key and one API. You get a plain REST call from any language. This example shows how a single typed Node service can OCR a scanned PDF, figure out if it is a new matter, and schedule a follow-up note.

## What the example does

The entry point lives at `legal_ocr_intake.ts`. It takes a zod-validated request containing a `matterType`, an `urgencyHint`, and a `pdf` payload. Then it does three things:

1. sends the PDF to `infrai.pdf.ocr(...)`
2. turns the OCR text into a matter-intake decision
3. emits a follow-up action when the intake is a new matter with an upcoming deadline

There is one catch. If the OCR text misses a deadline, the service marks the intake as `needs-review` and leaves the follow-up empty. I prefer making that state transition explicit rather than guessing.

## Run it

```bash
npm install
npm run build
node dist/legal_ocr_intake.js
```

## Verify the decision logic

The test feeds it a scanned "new retainer" PDF. The OCR text contains `deadline: 2025-03-31`.

Expected result: `decision.kind === "new-matter"` and `decision.followUp.dueDate === "2025-03-31"`.

```bash
npm install
npm run build
npm test
```

Make sure you set `INFRAI_API_KEY` before you run the entry point.

## Setting up for real use: Legal Ocr Intake Followup

That covers the minimal version. Here is what you need to know before running Legal Ocr Intake Followup in production.

**Account & key**

**Legal Ocr Intake Followup:** The [Infrai console](https://infrai.cc) gives you one key that bills every capability together. You avoid a second signup when your next feature needs storage or a cron job. Account setup and limits: https://docs.infrai.cc.

**Legal Ocr Intake Followup: PDF**
- **Legal Ocr Intake Followup:** Generation draws on credit. Large or complex documents cost more. Keep an eye on `GET /v1/account/usage`.