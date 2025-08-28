
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function BMRCalculator(){
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(1.4); // lightly active

  const bmr = useMemo(()=>{
    // Mifflin-St Jeor
    if (sex === "male") return 10*weight + 6.25*height - 5*age + 5;
    return 10*weight + 6.25*height - 5*age - 161;
  }, [sex, age, height, weight]);

  const tdee = useMemo(()=> bmr*activity, [bmr, activity]);

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader><CardTitle className="text-lg">محاسبه BMR و کالری روزانه</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="col-span-2 md:col-span-1">
            <Label>جنسیت</Label>
            <div className="flex gap-2 mt-1">
              <button onClick={()=>setSex("male")} className={`px-3 py-1.5 rounded-md border ${sex==="male"?"bg-neutral-900 text-white dark:bg-white dark:text-neutral-900":""}`}>مرد</button>
              <button onClick={()=>setSex("female")} className={`px-3 py-1.5 rounded-md border ${sex==="female"?"bg-neutral-900 text-white dark:bg-white dark:text-neutral-900":""}`}>زن</button>
            </div>
          </div>
          <div><Label>سن (سال)</Label><Input inputMode="decimal" value={age} onChange={e=>setAge(Number(e.target.value||0))}/></div>
          <div><Label>قد (سانتی‌متر)</Label><Input inputMode="decimal" value={height} onChange={e=>setHeight(Number(e.target.value||0))}/></div>
          <div><Label>وزن (کیلوگرم)</Label><Input inputMode="decimal" value={weight} onChange={e=>setWeight(Number(e.target.value||0))}/></div>
          <div className="col-span-2 md:col-span-2">
            <Label>سطح فعالیت</Label>
            <select className="w-full mt-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2"
                    value={activity} onChange={e=>setActivity(Number(e.target.value))}>
              <option value={1.2}>خیلی کم‌تحرک (1.2)</option>
              <option value={1.375}>کم‌تحرک (1.375)</option>
              <option value={1.55}>متوسط (1.55)</option>
              <option value={1.725}>فعال (1.725)</option>
              <option value={1.9}>بسیار فعال (1.9)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat title="BMR (کالری در روز)" value={formatNumber(bmr)} />
          <Stat title="TDEE (کالری نگهدارنده)" value={formatNumber(tdee)} />
          <Stat title="کاهش وزن (−500)" value={formatNumber(tdee-500)} />
          <Stat title="افزایش وزن (+300)" value={formatNumber(tdee+300)} />
        </div>
      </CardContent>
    </Card>
  )
}

function formatNumber(n){ return new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(isNaN(n)?0:n); }

function Stat({title, value}){
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  )
}
