export default async function handler(req, res) {
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  });

  const tokenData = await tokenResponse.json();
  const access_token = tokenData.access_token;

  const nowPlaying = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const data = nowPlaying.status === 204 ? null : await nowPlaying.json();
  res.status(200).json(data);
}

