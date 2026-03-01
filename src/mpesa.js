export async function stkPush({ phone, amount, ref }) {
  try {
    const response = await fetch('http://localhost:3001/api/mpesa/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        amount,
        accountReference: ref,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('M-Pesa request failed:', error);
    throw error;
  }
}