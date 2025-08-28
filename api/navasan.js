// /api/navasan.js
export default async function handler(req, res) {
  try {
    const key = process.env.NAVASAN_KEY;
    const { fn = "latest", item, start, end } = req.query;

    let url;
    if (fn === "ohlcSearch") {
      url = `http://api.navasan.tech/ohlcSearch/?api_key=${key}&item=${item}&start=${start}&end=${end}`;
    } else {
      url = `http://api.navasan.tech/latest/?api_key=${key}`;
    }

    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
