
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SYMBOLS = [
  { key: "usd_sell", label: "دلار (فروش تهران)" },
  { key: "eur", label: "یورو" },
  { key: "gbp", label: "پوند" },
  { key: "aed_sell", label: "درهم دوبی (فروش)" },
  { key: "try", label: "لیر ترکیه" },
];

function toTS(daysAgo=0){
  const d = new Date();
  d.setHours(23,59,59,999);
  d.setDate(d.getDate() - daysAgo);
  return Math.floor(d.getTime()/1000);
}

export default function CurrencyWidget(){
  const [toman, setToman] = useState(Boolean(JSON.parse(localStorage.getItem('toman')||'false')));
  const [symbol, setSymbol] = useState(localStorage.getItem("curr_symbol") || "usd_sell");
  const [range, setRange] = useState(Number(localStorage.getItem("curr_range") || 30));
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_NAVASAN_KEY;

  const fetchLatest = async () => {
    const url = `https://api.navasan.tech/latest/?api_key=${API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  };

  const fetchOHLC = async (sym, days) => {
    const end = toTS(0);
    const start = toTS(days);
    const url = `https://api.navasan.tech/ohlcSearch/?api_key=${API_KEY}&item=${sym}&start=${start}&end=${end}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  };

  const refresh = async () => {
    try{
      setLoading(true); setError("");
      const latest = await fetchLatest();
      const ohlc = await fetchOHLC(symbol, range);
      setData({ latest, ohlc });
      setLast(new Date());
    }catch(e){
      setError("خطا در دریافت نرخ‌ها");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ refresh(); const id=setInterval(refresh, 60*60*1000); return ()=>clearInterval(id); }, []);
  useEffect(()=>{ localStorage.setItem('toman', JSON.stringify(toman)); }, [toman]);
  useEffect(()=>{ localStorage.setItem('curr_symbol', symbol); localStorage.setItem('curr_range', String(range)); refresh(); }, [symbol, range]);

  const list = useMemo(()=>{
    if (!data?.latest) return [];
    return SYMBOLS.map(it => {
      const row = data.latest[it.key];
      return {
        code: it.key,
        label: it.label,
        value: row?.value ? Number(row.value) : null,
        change: row?.change ?? null,
        date: row?.date ?? null
      };
    });
  }, [data]);

  const chartData = useMemo(()=>{
    const arr = Array.isArray(data?.ohlc) ? data.ohlc : [];
    return arr.map((row) => {
      const x = row.date || row.timestamp;
      const close = Number(row.close);
      return { x: String(x), close };
    });
  }, [data]);

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg">نرخ ارز محبوب</CardTitle>
        <div className="flex items-center gap-3">
          <select value={symbol} onChange={e=>setSymbol(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-2 py-1 text-sm">
            {SYMBOLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={range} onChange={e=>setRange(Number(e.target.value))}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-2 py-1 text-sm">
            <option value={7}>۷ روز</option>
            <option value={30}>۳۰ روز</option>
            <option value={90}>۹۰ روز</option>
            <option value={180}>۱۸۰ روز</option>
            <option value={365}>۱ سال</option>
          </select>
          <label className="text-xs text-neutral-600 inline-flex items-center gap-2">
            <input type="checkbox" checked={toman} onChange={e=>setToman(e.target.checked)} />
            نمایش به تومان
          </label>
          <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>به‌روزرسانی</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error && <div className="text-red-500">{error}</div>}
        {!data ? (
          <div className="text-neutral-500">{loading ? "در حال دریافت..." : "نرخ‌ها حاضر نیستند."}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {list.map((it)=> (
                <div key={it.code} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60">
                  <div className="text-xs text-neutral-500">{it.label}</div>
                  <div className="font-bold">{it.value ? (toman ? formatCurrencyToman(it.value) : formatCurrencyInner(it.value)) : "—"}</div>
                  <div className="text-xs text-neutral-500">{it.change != null ? `تغییر روز: ${formatNumber(it.change)}` : ""}</div>
                </div>
              ))}
            </div>

            <div className="h-64 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-2">
              {chartData.length === 0 ? (
                <div className="text-neutral-500 p-4">دادهٔ نمودار در دسترس نیست.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} tickFormatter={(v)=> toman ? formatNumber(v/10) : formatNumber(v)} />
                    <Tooltip formatter={(v)=> toman ? `${formatNumber(v/10)} تومان` : `${formatNumber(v)} ریال`} />
                    <Area type="monotone" dataKey="close" stroke="currentColor" fillOpacity={1} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
        <div className="text-xs text-neutral-500">آخرین به‌روزرسانی: {last ? last.toLocaleString("fa-IR") : "—"}</div>
      </CardContent>
    </Card>
  );
}

function formatNumber(n){ return new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(isNaN(n)?0:n); }
function formatCurrencyInner(n){ return n ? `${formatNumber(n)} ریال` : "—"; }
function formatCurrencyToman(n){ return n ? `${formatNumber(n/10)} تومان` : "—"; }
