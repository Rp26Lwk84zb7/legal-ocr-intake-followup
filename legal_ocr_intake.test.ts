import test from 'node:test';
import assert from 'node:assert/strict';
import { decideMatterFlow } from './legal_ocr_intake.js';

test('new matter with a deadline becomes a follow-up task', () => {
  const inputText = 'retainer received\ndeadline: 2025-03-31\nclient: Northwind';
  const decision = decideMatterFlow(inputText, 'new-matter');

  assert.equal(decision.kind, 'new-matter');
  assert.deepEqual(decision.followUp, {
    dueDate: '2025-03-31',
    note: 'Send the intake follow-up note'
  });
});
