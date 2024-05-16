import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      const url = 'https://asia-northeast1-mizuki-demo-joonix.cloudfunctions.net/cf_create_summary';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary from Cloud Function');
      }

      // Cloud Function からのレスポンスを JSON として解析
      const summaryData = await response.json(); 

      // レスポンスを JSON として返す
      res.status(200).json(summaryData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}