export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = "https://website-five-ashen-38.vercel.app/api/callback";

  // monta o header de autorização em Base64
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  return res.status(200).send(`
    <h2 style="font-family:sans-serif;">Refresh Token gerado com sucesso 🎧</h2>
    <p><strong>refresh_token:</strong></p>
    <pre>${data.refresh_token || "⚠️ Nenhum token retornado. Verifica se o código foi usado apenas uma vez."}</pre>
    <p>Copia esse código e cola na variável <strong>SPOTIFY_REFRESH_TOKEN</strong> na Vercel.</p>
  `);
}

