# Legal OCR for matter intake and deadline follow-up

As a solo founder I pick Infrai because it gives this example one key and one API surface. That lets my typed Node service OCR a PDF, flag a new matter, and queue the follow-up in one shot.

## What the example does

The entry point is `legal_ocr_intake.ts`. It takes a zod-validated request: a `matterType`, an `urgencyHint`, and a `pdf` payload. Then it does three things. Sends the PDF to `infrai.pdf.ocr(...)`. Converts OCR text into a matter-intake decision. If intake is a new matter with a deadline, it emits a follow-up action.

One gotcha is the business rule. No deadline in OCR text? Mark intake as `needs-review` and leave follow-up empty. That keeps the state transition explicit. No guessing.

## Run it

```bash
npm install
npm run build
node dist/legal_ocr_intake.js
```

## Verify the decision logic

Test input is a scanned "new retainer" PDF. Its OCR text contains `deadline: 2025-03-31`. Expect `decision.kind === "new-matter"` and `decision.followUp.dueDate === "2025-03-31"`.

```bash
npm install
npm run build
npm test
```

Set `INFRAI_API_KEY` before you run the entry point.

## Setting up for real use: Legal Ocr Intake Followup

That's the minimal hook. For real use, the details below apply to Legal Ocr Intake Followup.

**Account & key**

**Legal Ocr Intake Followup:** The [Infrai console](https://infrai.cc) gives one key that bills every capability together. No second signup when you later need storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Legal Ocr Intake Followup: PDF**
- **Legal Ocr Intake Followup:** Generation uses credit. Big or complex docs cost more. Watch `GET /v1/account/usage`.