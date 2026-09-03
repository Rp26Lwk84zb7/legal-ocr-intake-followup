import { z } from 'zod';
import { infrai } from './infrai.js';

const IntakeRequest = z.object({
  matterType: z.enum(['new-matter', 'signed-delivery', 'deadline-follow-up']),
  urgencyHint: z.enum(['low', 'normal', 'high']),
  pdf: z.string().min(1),
  lang: z.string().optional(),
  quality: z.string().optional()
});

export type IntakeRequest = z.infer<typeof IntakeRequest>;

export type IntakeDecision =
  | { kind: 'new-matter'; searchableText: string; followUp: { dueDate: string; note: string } }
  | { kind: 'signed-delivery'; searchableText: string; followUp: null }
  | { kind: 'needs-review'; searchableText: string; followUp: null };

export function decideMatterFlow(searchableText: string, matterType: IntakeRequest['matterType']): IntakeDecision {
  const deadlineMatch = searchableText.match(/deadline:\s*(\d{4}-\d{2}-\d{2})/i);
  if (matterType === 'new-matter' && deadlineMatch) {
    return {
      kind: 'new-matter',
      searchableText,
      followUp: {
        dueDate: deadlineMatch[1],
        note: 'Send the intake follow-up note'
      }
    };
  }

  if (matterType === 'signed-delivery') {
    return {
      kind: 'signed-delivery',
      searchableText,
      followUp: null
    };
  }

  return {
    kind: 'needs-review',
    searchableText,
    followUp: null
  };
}

export async function runIntake(input: unknown): Promise<IntakeDecision> {
  const request = IntakeRequest.parse(input);
  const ocr = await infrai.pdf.ocr({ pdf: request.pdf, lang: request.lang, quality: request.quality });
  return decideMatterFlow(ocr.text, request.matterType);
}

async function main() {
  const exampleInput = {
    matterType: 'new-matter',
    urgencyHint: 'high',
    pdf: 'base64-scanned-pdf',
    lang: 'eng',
    quality: 'high'
  };

  const decision = await runIntake(exampleInput);
  console.log(JSON.stringify(decision, null, 2));
}

if (process.argv[1]?.endsWith('legal_ocr_intake.js')) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
