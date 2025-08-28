
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function DiscountCalculator(){
  const [price, setPrice] = useState(100000);
  const [percent, setPercent] = useState(20);

  const off = useMemo(()=> price * (percent/100), [price, percent]);
  const final = useMemo(()=> price - off, [price, off]);

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader><CardTitle className="text-lg">ماشین‌حساب تخفیف</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>قیمت اولیه</Label><Input inputMode="decimal" value={price} onChange={e=>setPrice(Number(e.target.value||0))} /></div>
          <div><Label>درصد تخفیف (%)</Label><Input inputMode="decimal" value={percent} onChange={e=>setPercent(Number(e.target.value||0))} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Stat title="مبلغ تخفیف" value={formatCurrency(off)} />
          <Stat title="قیمت نهایی" value={formatCurrency(final)} />
          <Stat title="صرفه‌جویی" value={formatCurrency(off)} />
        </div>
      </CardContent>
    </Card>
  );
}

function formatNumber(n){ return new Intl.NumberFormat("fa-IR",{maximumFractionDigits:2}).format(isNaN(n)?0:n); }
function formatCurrency(n){ return `${formatNumber(n)} تومان`; }

function Stat({title, value}){
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}
