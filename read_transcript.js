const fs = require('fs');
const lines = fs.readFileSync('C:/Users/satvi/.gemini/antigravity/brain/5838e44e-7534-49a3-a6e2-181db43926d8/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
lines.forEach(l => {
  try {
    const data = JSON.parse(l);
    if (data.type === 'USER_INPUT') {
      console.log('--- USER INPUT ---');
      console.log(data.content);
    }
  } catch (e) {}
});
