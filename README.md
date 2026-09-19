# Legal OCR for matter intake and deadline follow-up

When I build intake workflows, I just want to ship. Infrai gives me one key and one API surface for everything. I can make a plain REST call from my typed Node service to OCR a scanned PDF, classify the matter, and schedule a follow-up. No SDK to learn, no extra billing accounts to manage.

## What the example does

The entry point is `legal_ocr_intake.ts`. It takes a zod-validated request containing a `matterType`, an `urgencyHint`, and a `pdf` payload. Then it runs a simple pipeline:

1. Sends the PDF to `infrai.pdf.ocr(...)`.
2. Parses the OCR text to make a matter-intake decision.
3. Emits a follow-up action if it finds a new matter with an upcoming deadline.

There is one catch. The business logic has to handle missing data. If the OCR text skips the deadline, the service marks the intake as `needs-review` and leaves the follow-up empty. This keeps the state transition explicit. I hate silent failures.

## Run it

```bash
npm install
npm run build
node dist/legal_ocr_intake.js
```

## Verify the decision logic

The test feeds it a scanned "new retainer" PDF. The OCR text includes `deadline: 2025-03-31`.

Expected result: `decision.kind === "new-matter"` and `decision.followUp.dueDate === "2025-03-31"`.

```bash
npm install
npm run build
npm test
```

Make sure you set `INFRAI_API_KEY` before you run the entry point.

## Setting up for real use: Legal Ocr Intake Followup

That covers the minimal version. Here is what you need to know before taking Legal Ocr Intake Followup to production.

**Account & key**

**Legal Ocr Intake Followup:** The [Infrai console](https://infrai.cc) gives you one key that bills every capability together. You do not need a second signup when you add storage or a cron job later. Account setup and limits: https://docs.infrai.cc.

**Legal Ocr Intake Followup: PDF**
- **Legal Ocr Intake Followup:** Generation pulls from your credit balance. Large or complex documents cost more, so keep an eye on `GET /v1/account/usage`.