export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "https://website-five-ashen-38.vercel.app/api/callback");
  params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
  params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json();

  // Mostra o refresh_token na tela pra tu copiar
  return res.status(200).send(`
    <h2 style="font-family:sans-serif;">Refresh Token gerado com sucesso 🎧</h2>
    <p><strong>refresh_token:</strong></p>
    <pre>${data.refresh_token}</pre>
    <p>Copia esse código e cola na variável <strong>SPOTIFY_REFRESH_TOKEN</strong> na Vercel.</p>
  `);
}
