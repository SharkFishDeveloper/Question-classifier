import { testSentences } from "./testData.js";
import modelData from "./model2.js";

const weights = modelData.weights[0];
const bias = modelData.bias[0];
const vocabulary = modelData.vocabulary;

let correct = 0;
let total = 0;

for (const [sentence, expected] of Object.entries(testSentences)) {
  const counts = new Array(Object.keys(vocabulary).length).fill(0);
  const tokens = sentence.toLowerCase().split(/\s+/);

  for (const token of tokens) {
    if (vocabulary.hasOwnProperty(token)) {
      const idx = vocabulary[token];
      counts[idx] += 1;
    }
  }

  let score = bias;
  for (let i = 0; i < counts.length; i++) {
    score += counts[i] * weights[i];
  }

  const probability = 1 / (1 + Math.exp(-score));
  const predictedLabel = probability > 0.5 ? "QUESTION" : "STATEMENT";

  if (predictedLabel === expected) {
    correct++;
  } else {
    console.log(
      `❌ Wrong prediction:\n   Sentence: "${sentence}"\n   Predicted: ${predictedLabel}\n   Expected: ${expected}`
    );
  }

  total++;
}

const accuracy = (correct / total) * 100;
console.log(`\n Accuracy: ${accuracy.toFixed(2)}%`);
