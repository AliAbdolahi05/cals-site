
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function diff(from, to){
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

export default function AgeCalculator(){
  const [y, setY] = useState(2009);
  const [m, setM] = useState(3);
  const [d, setD] = useState(22);

  const now = new Date();
  const birth = useMemo(() => new Date(y, m-1, d), [y,m,d]);
  const { years, months, days } = useMemo(() => diff(birth, now), [birth]);

  // Next birthday
  const next = new Date(now.getFullYear(), m-1, d);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const until = Math.ceil((next - now) / (1000*60*60*24));

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader><CardTitle className="text-lg">محاسبه سن دقیق</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-3 gap-3">
          <div><Label>سال</Label><Input value={y} onChange={e=>setY(Number(e.target.value||0))} /></div>
          <div><Label>ماه</Label><Input value={m} onChange={e=>setM(Number(e.target.value||0))} /></div>
          <div><Label>روز</Label><Input value={d} onChange={e=>setD(Number(e.target.value||0))} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Stat title="سال" value={years} />
          <Stat title="ماه" value={months} />
          <Stat title="روز" value={days} />
        </div>
        <div className="text-neutral-600">روزهای مانده تا تولد بعدی: <b>{until}</b></div>
      </CardContent>
    </Card>
  );
}

function Stat({title, value}){
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}
