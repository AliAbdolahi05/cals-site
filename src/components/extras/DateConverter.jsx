
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toJalaali, toGregorian, gregorianToHijri, hijriToGregorian } from "../../utils/jalaali";

function pad(n){ return String(n).padStart(2, "0"); }

export default function DateConverter(){
  const [gy, setGy] = useState(2025);
  const [gm, setGm] = useState(8);
  const [gd, setGd] = useState(28);

  const j = useMemo(() => toJalaali(gy, gm, gd), [gy, gm, gd]);
  const h = useMemo(() => gregorianToHijri(gy, gm, gd), [gy, gm, gd]);

  // Convert back samples (from user-entered Jalali/Hijri)
  const [jy, setJy] = useState(1404);
  const [jm, setJm] = useState(6);
  const [jd, setJd] = useState(6);

  const gFromJ = useMemo(() => toGregorian(jy, jm, jd), [jy, jm, jd]);

  const [hy, setHy] = useState(1447);
  const [hm, setHm] = useState(2);
  const [hd, setHd] = useState(3);
  const gFromH = useMemo(() => hijriToGregorian(hy, hm, hd), [hy, hm, hd]);

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader>
        <CardTitle className="text-lg">تبدیل تاریخ: میلادی ⇄ شمسی ⇄ قمری (تقریبی)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-bold mb-2">از میلادی →</div>
            <Label>تاریخ میلادی (Y-M-D)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input value={gy} onChange={e=>setGy(Number(e.target.value||0))} />
              <Input value={gm} onChange={e=>setGm(Number(e.target.value||0))} />
              <Input value={gd} onChange={e=>setGd(Number(e.target.value||0))} />
            </div>
          </div>
          <Stat title="تاریخ شمسی" value={`${j.jy}/${pad(j.jm)}/${pad(j.jd)}`} />
          <Stat title="تاریخ قمری (تقریبی)" value={`${h.hy}/${pad(h.hm)}/${pad(h.hd)}`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-bold mb-2">از شمسی → میلادی</div>
            <div className="grid grid-cols-3 gap-2">
              <Input value={jy} onChange={e=>setJy(Number(e.target.value||0))} />
              <Input value={jm} onChange={e=>setJm(Number(e.target.value||0))} />
              <Input value={jd} onChange={e=>setJd(Number(e.target.value||0))} />
            </div>
            <div className="mt-2 text-neutral-600">نتیجه: {gFromJ.gy}/{pad(gFromJ.gm)}/{pad(gFromJ.gd)}</div>
          </div>

          <div>
            <div className="font-bold mb-2">از قمری (تقریبی) → میلادی</div>
            <div className="grid grid-cols-3 gap-2">
              <Input value={hy} onChange={e=>setHy(Number(e.target.value||0))} />
              <Input value={hm} onChange={e=>setHm(Number(e.target.value||0))} />
              <Input value={hd} onChange={e=>setHd(Number(e.target.value||0))} />
            </div>
            <div className="mt-2 text-neutral-600">نتیجه: {gFromH.gy}/{pad(gFromH.gm)}/{pad(gFromH.gd)}</div>
          </div>
        </div>

        <div className="text-xs text-neutral-500">
          *تبدیل قمری تقریبی است و ممکن است ±۱ روز اختلاف داشته باشد.
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ title, value }){
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}
