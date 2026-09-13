import assert from 'node:assert/strict';
import { classifyTask, generateQuestFlavor } from '../services/llm';

async function runLlmTests() {
  console.log('Running LLM Fallback & Guardrail Tests...\n');

  // 1. Safe fallback without API key configured
  delete process.env.MISTRAL_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;

  const fallbackClassification = await classifyTask('Read 5 chapters of system design');
  assert.equal(fallbackClassification.category, 'DISCIPLINE');
  assert.equal(fallbackClassification.difficulty, 'EASY');
  console.log('✔ LLM service falls back gracefully when API keys are unconfigured');

  // 2. Flavor generation fallback
  const rawTitle = 'Clean up desk and organise study room';
  const flavor = await generateQuestFlavor(rawTitle, 'DISCIPLINE');
  assert.equal(flavor, rawTitle);
  console.log('✔ Flavor generation safely defaults to original text on failure');

  console.log('\nAll LLM guardrail tests passed successfully!');
}

runLlmTests();
