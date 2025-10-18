export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return res.status(400).json({ error: "Failed to get access token", tokenData });
  }

  const access_token = tokenData.access_token;

  const recentResponse = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=4",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const recentData = await recentResponse.json();
  if (recentData.error) return res.status(400).json(recentData);

  const tracks = recentData.items.map(item => ({
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(", "),
    album: item.track.album.name,
    image: item.track.album.images[1]?.url,
    url: item.track.external_urls.spotify,
  }));

  res.status(200).json({ tracks });
}

