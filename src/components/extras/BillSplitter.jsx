
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function BillSplitter(){
  const [total, setTotal] = useState(800000);
  const [people, setPeople] = useState(4);
  const [tip, setTip] = useState(10);
  const [tax, setTax] = useState(0);

  const tipAmt = useMemo(()=> total * (tip/100), [total, tip]);
  const taxAmt = useMemo(()=> total * (tax/100), [total, tax]);
  const final = total + tipAmt + taxAmt;
  const each = useMemo(()=> (people>0? final/people : 0), [final, people]);

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader><CardTitle className="text-lg">تقسیم صورت‌حساب</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><Label>مبلغ کل</Label><Input inputMode="decimal" value={total} onChange={e=>setTotal(Number(e.target.value||0))}/></div>
          <div><Label>تعداد افراد</Label><Input inputMode="decimal" value={people} onChange={e=>setPeople(Number(e.target.value||0))}/></div>
          <div><Label>انعام (%)</Label><Input inputMode="decimal" value={tip} onChange={e=>setTip(Number(e.target.value||0))}/></div>
          <div><Label>مالیات (%)</Label><Input inputMode="decimal" value={tax} onChange={e=>setTax(Number(e.target.value||0))}/></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat title="مبلغ انعام" value={formatCurrency(tipAmt)} />
          <Stat title="مبلغ مالیات" value={formatCurrency(taxAmt)} />
          <Stat title="جمع نهایی" value={formatCurrency(final)} />
          <Stat title="سهم هر نفر" value={formatCurrency(each)} />
        </div>
      </CardContent>
    </Card>
  )
}

function formatNumber(n){ return new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(isNaN(n)?0:n); }
function formatCurrency(n){ return `${formatNumber(n)} تومان`; }

function Stat({title, value}){
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}
