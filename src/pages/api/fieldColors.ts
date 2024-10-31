import { NextApiRequest, NextApiResponse } from 'next';

let fieldColors: Record<string, string> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(fieldColors);
  } else if (req.method === 'POST') {
    const { key, color } = req.body;
    if (key && color) {
      fieldColors[key] = color;
      res.status(200).json({ message: 'Color set successfully' });
    } else {
      res.status(400).json({ message: 'Invalid request' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
