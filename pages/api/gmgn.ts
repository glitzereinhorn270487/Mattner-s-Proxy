
        import type { NextApiRequest, NextApiResponse } from 'next';

        export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          try {
            const response = await fetch("https://gmgn.ai/api/tokens");
            const data = await response.json();
            res.status(200).json(data);
          } catch (error: any) {
            console.error("Fehler bei GMGN Proxy:", error.message);
            res.status(500).json({ error: "Fehler beim Abrufen von GMGN-Daten" });
          }
        }
        ```
