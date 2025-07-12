/**
 * Example: Using Pollinations AI with Token Authentication
 * 
 * This example shows how to make authenticated requests to Pollinations AI
 * using both URL parameter and Authorization header methods.
 */

// Method 1: URL Parameter Authentication
async function callWithUrlToken(token, prompt) {
  const url = `https://text.pollinations.ai/openai?token=${token}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai-fast',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}

// Method 2: Authorization Header Authentication
async function callWithAuthHeader(token, prompt) {
  const url = 'https://text.pollinations.ai/openai';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      model: 'openai-fast',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}

// Example usage (replace with your actual token)
const token = process.env.POLLINATIONS_AI_TOKEN || 'your_token_here';
const prompt = 'Hello, how are you?';

// Test both methods
async function testAuthentication() {
  try {
    console.log('Testing URL parameter authentication...');
    const result1 = await callWithUrlToken(token, prompt);
    console.log('URL Token Result:', result1.choices[0].message.content);

    console.log('\nTesting Authorization header authentication...');
    const result2 = await callWithAuthHeader(token, prompt);
    console.log('Auth Header Result:', result2.choices[0].message.content);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testAuthentication();
}

module.exports = {
  callWithUrlToken,
  callWithAuthHeader
};