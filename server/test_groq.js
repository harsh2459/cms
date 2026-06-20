require('dotenv').config();
const axios = require('axios');

async function testGroq() {
  const apiKey = process.env.GROK_API_KEY;
  const apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
  const model = process.env.GROK_MODEL || 'grok-beta';

  console.log({ apiKey: apiKey?.substring(0, 5) + '...', apiUrl, model });

  try {
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          { role: 'system', content: 'Respond with ONLY a JSON object: { "success": true }' },
          { role: 'user', content: 'test' },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    console.log(response.data);
  } catch (err) {
    console.error('ERROR:', err.response?.data || err.message);
  }
}
testGroq();
