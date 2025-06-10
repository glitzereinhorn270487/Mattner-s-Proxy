import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://gmgn.ai/api/tokens");
    // Prüfe, ob die Antwort erfolgreich war (Status 2xx)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GMGN API returned non-OK status: ${response.status} - ${errorText}`);
      return res.status(response.status).json({
        error: `Fehler von GMGN-API: ${response.status} ${response.statusText}`,
        details: errorText.substring(0, Math.min(errorText.length, 200))
      });
    }

    // Prüfe den Content-Type, um sicherzustellen, dass es JSON ist
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error(`GMGN API did not return JSON. Content-Type: ${contentType}. Body start: ${responseText.substring(0, Math.min(responseText.length, 200))}`);
      return res.status(500).json({
        error: "GMGN-API hat kein JSON zurückgegeben. Möglicherweise blockiert.",
        receivedContentType: contentType,
        responseTextSnippet: responseText.substring(0, Math.min(responseText.length, 200))
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error: any) {
    console.error("Fehler bei GMGN Proxy:", error.message);
    res.status(500).json({ error: "Interner Serverfehler beim Abrufen von GMGN-Daten", details: error.message });
  }
}
