
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  PiggyBank,
  Wallet,
  Activity,
  Ruler,
  Percent,
  Sun,
  Moon,
  Link as LinkIcon,
  Save,
  Trash2,
  History,
  Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import DateConverter from "./components/extras/DateConverter";
import AgeCalculator from "./components/extras/AgeCalculator";
import DiscountCalculator from "./components/extras/DiscountCalculator";
import CurrencyWidget from "./components/extras/CurrencyWidget";
import BillSplitter from "./components/extras/BillSplitter";
import BMRCalculator from "./components/extras/BMRCalculator";

// ===================== Helpers & Infrastructure ===================== //
const formatNumber = (n) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(
    isNaN(n) ? 0 : n
  );
const formatCurrency = (n) => `${formatNumber(n)} تومان`;

const ROUTES = [
  { key: "home", label: "همه ابزارها", icon: Home },
  { key: "loan", label: "قسط و وام", icon: PiggyBank },
  { key: "salary", label: "حقوق و اضافه‌کاری", icon: Wallet },
  { key: "bmi", label: "BMI", icon: Activity },
  { key: "vat", label: "مالیات ارزش افزوده", icon: Percent },
  { key: "convert", label: "تبدیل واحد", icon: Ruler },
  { key: "date", label: "تبدیل تاریخ", icon: Ruler },
  { key: "age", label: "سن", icon: Activity },
  { key: "discount", label: "تخفیف", icon: Percent },
  { key: "currency", label: "نرخ ارز", icon: Wallet },
  { key: "bill", label: "تقسیم صورتحساب", icon: Wallet },
  { key: "bmr", label: "BMR/کالری", icon: Activity },
];

function useHashRoute() {
  const parse = () => {
    const raw = window.location.hash || "";
    let hash = raw;
    if (hash.startsWith("#/")) hash = hash.slice(2);
    else if (hash.startsWith("#")) hash = hash.slice(1);
    const [path, queryString] = hash.split("?");
    const route = ROUTES.find((r) => r.key === (path || "home"))?.key || "home";
    const params = Object.fromEntries(new URLSearchParams(queryString || ""));
    return { route, params };
  };
  const [{ route, params }, setState] = useState(() => ({ route: "home", params: {} }));
  useEffect(() => {
    const update = () => setState(parse());
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const navigate = (key, nextParams) => {
    const qs = nextParams ? `?${new URLSearchParams(nextParams).toString()}` : "";
    window.location.hash = `/${key}${qs}`;
  };
  return { route, params, navigate };
}

const HISTORY_KEY = "calc_history_v1";
function pushHistory(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    list.unshift({ ...entry, ts: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
  } catch {}
}
function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function useTheme() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return { theme, setTheme };
}

function Stat({ title, value }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-inner">
      <div className="text-xs text-neutral-500 mb-1">{title}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  );
}

function HeaderBar({ onToggleTheme, theme, current, onNav }) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg">
            <img src="/logo.png" alt="لوگو" className="w-8 h-8 rounded-md" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">ماشین‌حساب‌های کاربردی</h1>
            <p className="text-neutral-500 text-sm">سریع، دقیق و زیبا — برای استفاده روزمره</p>
          </div>
        </div>
        <Button variant="outline" onClick={onToggleTheme} className="rounded-xl">
          {theme === "dark" ? (
            <div className="flex items-center gap-2"><Sun className="w-4 h-4" /> حالت روشن</div>
          ) : (
            <div className="flex items-center gap-2"><Moon className="w-4 h-4" /> حالت تیره</div>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROUTES.map((r) => (
          <Button
            key={r.key}
            variant={current === r.key ? "default" : "secondary"}
            className={`rounded-xl ${current === r.key ? "" : "bg-white/60 dark:bg-neutral-800/60"}`}
            onClick={() => onNav(r.key)}
          >
            <r.icon className="w-4 h-4 ml-2" /> {r.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-30 bg-fuchsia-400"></div>
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-3xl opacity-30 bg-sky-400"></div>
    </div>
  );
}

// ===================== Calculators (existing ones should already be defined elsewhere) ===================== //
function LoanCalculator({ params }) {
  const [P, setP] = useState(Number(params.p ?? 20000000));
  const [rate, setRate] = useState(Number(params.rate ?? 18));
  const [months, setMonths] = useState(Number(params.n ?? 24));

  const { monthly, totalPay, totalInterest } = useMemo(() => {
    const r = (rate / 100) / 12;
    const n = Number(months);
    const p = Number(P);
    if (n <= 0 || p <= 0) return { monthly: 0, totalPay: 0, totalInterest: 0 };
    if (r === 0) {
      const m = p / n;
      return { monthly: m, totalPay: m * n, totalInterest: m * n - p };
    }
    const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tp = m * n;
    return { monthly: m, totalPay: tp, totalInterest: tp - p };
  }, [P, rate, months]);

  const shareParams = { p: P, rate, n: months };

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <PiggyBank className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">ماشین‌حساب قسط و وام</CardTitle>
        </div>
        <ActionRow type="loan" params={shareParams} results={{ monthly, totalPay, totalInterest }} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="مبلغ وام" value={P} onChange={setP} />
          <Field label="نرخ سود سالانه (%)" value={rate} onChange={setRate} />
          <Field label="مدت بازپرداخت (ماه)" value={months} onChange={setMonths} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <Stat title="قسط ماهانه" value={formatCurrency(monthly)} />
          <Stat title="جمع پرداخت" value={formatCurrency(totalPay)} />
          <Stat title="جمع سود" value={formatCurrency(totalInterest)} />
        </div>
      </CardContent>
    </Card>
  );
}

function SalaryOvertimeCalculator({ params }) {
  const [hourly, setHourly] = useState(Number(params.h ?? 120000));
  const [regularHrs, setRegularHrs] = useState(Number(params.rh ?? 176));
  const [overtimeHrs, setOvertimeHrs] = useState(Number(params.oh ?? 20));
  const [multiplier, setMultiplier] = useState(Number(params.m ?? 1.4));

  const base = useMemo(() => Number(hourly) * Number(regularHrs), [hourly, regularHrs]);
  const ot = useMemo(() => Number(hourly) * Number(overtimeHrs) * Number(multiplier), [hourly, overtimeHrs, multiplier]);
  const total = base + ot;

  const shareParams = { h: hourly, rh: regularHrs, oh: overtimeHrs, m: multiplier };

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">محاسبه حقوق با اضافه‌کاری</CardTitle>
        </div>
        <ActionRow type="salary" params={shareParams} results={{ total, base, ot }} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Field label="دستمزد ساعتی (تومان)" value={hourly} onChange={setHourly} />
          <Field label="ساعات عادی (ماه)" value={regularHrs} onChange={setRegularHrs} />
          <Field label="ساعات اضافه‌کاری" value={overtimeHrs} onChange={setOvertimeHrs} />
          <Field label="ضریب اضافه‌کاری" value={multiplier} onChange={setMultiplier} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <Stat title="جمع حقوق ماه" value={formatCurrency(total)} />
          <Stat title="حقوق عادی" value={formatCurrency(base)} />
          <Stat title="اضافه‌کاری" value={formatCurrency(ot)} />
        </div>
      </CardContent>
    </Card>
  );
}

function BMICalculator({ params }) {
  const [weight, setWeight] = useState(Number(params.w ?? 70));
  const [height, setHeight] = useState(Number(params.h ?? 175));

  const { bmi, status } = useMemo(() => {
    const h = Number(height) / 100;
    const b = h > 0 ? Number(weight) / (h * h) : 0;
    let s = "نامشخص";
    if (b > 0) {
      if (b < 18.5) s = "کم‌وزن";
      else if (b < 25) s = "نرمال";
      else if (b < 30) s = "اضافه‌وزن";
      else s = "چاق";
    }
    return { bmi: b, status: s };
  }, [weight, height]);

  const shareParams = { w: weight, h: height };

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white">
            <Activity className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">ماشین‌حساب BMI</CardTitle>
        </div>
        <ActionRow type="bmi" params={shareParams} results={{ bmi, status }} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="وزن (کیلوگرم)" value={weight} onChange={setWeight} />
          <Field label="قد (سانتی‌متر)" value={height} onChange={setHeight} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Stat title="شاخص BMI" value={formatNumber(bmi)} />
          <Stat title="وضعیت" value={status} />
        </div>
      </CardContent>
    </Card>
  );
}

function VATCalculator({ params }) {
  const [amount, setAmount] = useState(Number(params.a ?? 1000000));
  const [vat, setVat] = useState(Number(params.v ?? 9));

  const tax = useMemo(() => (Number(amount) * Number(vat)) / 100, [amount, vat]);
  const total = useMemo(() => Number(amount) + tax, [amount, tax]);

  const shareParams = { a: amount, v: vat };

  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex flex-row items-center justify بین">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <Percent className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">محاسبه مالیات بر ارزش افزوده</CardTitle>
        </div>
        <ActionRow type="vat" params={shareParams} results={{ tax, total }} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="مبلغ کالا/خدمت" value={amount} onChange={setAmount} />
          <Field label="درصد مالیات (%)" value={vat} onChange={setVat} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <Stat title="مالیات" value={formatCurrency(tax)} />
          <Stat title="قیمت بدون مالیات" value={formatCurrency(amount)} />
          <Stat title="قیمت نهایی" value={formatCurrency(total)} />
        </div>
      </CardContent>
    </Card>
  );
}

function UnitConverter({ params }) {
  const [tab, setTab] = useState(params.t ?? "length");
  return (
    <Card className="rounded-2xl border-0 shadow-xl backdrop-blur bg-white/60 dark:bg-neutral-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <Ruler className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">تبدیل واحدها</CardTitle>
        </div>
        <ActionRow type="convert" params={{ t: tab }} />
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="length">طول</TabsTrigger>
            <TabsTrigger value="weight">وزن</TabsTrigger>
            <TabsTrigger value="temp">دما</TabsTrigger>
          </TabsList>
          <TabsContent value="length"><LengthConverter /></TabsContent>
          <TabsContent value="weight"><WeightConverter /></TabsContent>
          <TabsContent value="temp"><TempConverter /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function LengthConverter() {
  const [meters, setMeters] = useState(1);
  const km = useMemo(() => Number(meters) / 1000, [meters]);
  const cm = useMemo(() => Number(meters) * 100, [meters]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="متر" value={meters} onChange={setMeters} />
      <Stat title="کیلومتر" value={`${formatNumber(km)} km`} />
      <Stat title="سانتی‌متر" value={`${formatNumber(cm)} cm`} />
    </div>
  );
}
function WeightConverter() {
  const [kg, setKg] = useState(1);
  const g = useMemo(() => Number(kg) * 1000, [kg]);
  const lb = useMemo(() => Number(kg) * 2.2046226218, [kg]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="کیلوگرم" value={kg} onChange={setKg} />
      <Stat title="گرم" value={`${formatNumber(g)} g`} />
      <Stat title="پوند" value={`${formatNumber(lb)} lb`} />
    </div>
  );
}
function TempConverter() {
  const [c, setC] = useState(25);
  const f = useMemo(() => (Number(c) * 9) / 5 + 32, [c]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="سانتی‌گراد (°C)" value={c} onChange={setC} />
      <Stat title="فارنهایت" value={`${formatNumber(f)} °F`} />
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input inputMode="decimal" value={value} onChange={(e) => onChange(Number(e.target.value || 0))} />
    </div>
  );
}

function ActionRow({ type, params = {}, results = {} }) {
  const makeLink = () => {
    const qs = new URLSearchParams(params).toString();
    const url = `${window.location.origin}${window.location.pathname}#/${type}${qs ? `?${qs}` : ""}`;
    return url;
  };
  const copy = async () => {
    const link = makeLink();
    try {
      await navigator.clipboard.writeText(link);
      alert("لینک کپی شد ✅");
    } catch {
      prompt("این لینک را کپی کنید:", link);
    }
  };
  const save = () => {
    pushHistory({ type, params, results });
    alert("در تاریخچه ذخیره شد ✅");
  };
  const clear = () => {
    clearHistory();
    alert("تاریخچه پاک شد ✅");
  };
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" className="rounded-lg" onClick={copy}><LinkIcon className="w-4 h-4 ml-1"/>کپی لینک</Button>
      <Button size="sm" variant="secondary" className="rounded-lg" onClick={()=>{ const link = `${window.location.href}`; if (navigator.share) { navigator.share({ title: document.title, url: link }); } else { navigator.clipboard.writeText(link); alert("لینک برای اشتراک کپی شد ✅"); } }}>اشتراک</Button>
      <Button size="sm" variant="ghost" className="rounded-lg" onClick={clear}><Trash2 className="w-4 h-4 ml-1"/>پاک‌کردن تاریخچه</Button>
    </div>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const { route, params, navigate } = useHashRoute();

  useEffect(() => {
    const titleMap = {
      home: "ماشین‌حساب‌های کاربردی",
      loan: "ماشین‌حساب قسط و وام",
      salary: "محاسبه حقوق با اضافه‌کاری",
      bmi: "ماشین‌حساب BMI",
      vat: "محاسبه مالیات بر ارزش افزوده",
      convert: "تبدیل واحدها",
      date: "تبدیل تاریخ",
      age: "محاسبه سن",
      discount: "محاسبه تخفیف",
      currency: "نرخ ارز (ساعتی)",
      bill: "تقسیم صورتحساب",
      bmr: "BMR/کالری روزانه",
    };
    document.title = titleMap[route] + " | نسخه رایگان";
  }, [route]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Backdrop />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <HeaderBar
            theme={theme}
            onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            current={route}
            onNav={(k) => (window.location.hash = `/${k}`)}
          />

          {route === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LoanCalculator params={{}} />
              <SalaryOvertimeCalculator params={{}} />
              <BMICalculator params={{}} />
              <VATCalculator params={{}} />
              <div className="md:col-span-2"><UnitConverter params={{}} /></div>
              <DateConverter />
              <AgeCalculator />
              <DiscountCalculator />
              <CurrencyWidget />
              <BillSplitter />
              <BMRCalculator />
            </div>
          )}

          {route === "loan" && <LoanCalculator params={params} />}
          {route === "salary" && <SalaryOvertimeCalculator params={params} />}
          {route === "bmi" && <BMICalculator params={params} />}
          {route === "vat" && <VATCalculator params={params} />}
          {route === "convert" && <UnitConverter params={params} />}
          {route === "date" && <DateConverter />}
          {route === "age" && <AgeCalculator />}
          {route === "discount" && <DiscountCalculator />}
          {route === "currency" && (
            <>
              <CurrencyWidget />
              <BillSplitter />
              <BMRCalculator />
            </>
          )}
          {route === "bill" && <BillSplitter />}
          {route === "bmr" && <BMRCalculator />}

          <HistoryPanel />

          <footer className="mt-10 text-center text-sm text-neutral-500 space-y-1">
            <div>نسخه رایگان • بدون ثبت‌نام • هیچ داده‌ای به سرور ارسال نمی‌شود (ذخیره‌سازی فقط روی دستگاه شما)</div>
            <div>© {new Date().getFullYear()}</div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}

function HistoryPanel() {
  const [open, setOpen] = useState(false);
  const data = readHistory();
  return (
    <div className="mt-8">
      <Button variant="outline" className="rounded-xl" onClick={() => setOpen((s) => !s)}>
        <History className="w-4 h-4 ml-2" /> تاریخچه محاسبات ({data.length})
      </Button>
      {open && (
        <div className="mt-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60">
          {data.length === 0 ? (
            <div className="text-sm text-neutral-500">هنوز چیزی ذخیره نشده.</div>
          ) : (
            <ul className="space-y-3 text-sm">
              {data.map((it, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{labelOfType(it.type)}</div>
                    <div className="text-neutral-500">{new Date(it.ts).toLocaleString("fa-IR")}</div>
                  </div>
                  <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => {
                    const qs = new URLSearchParams(it.params).toString();
                    window.location.hash = `/${it.type}${qs ? `?${qs}` : ""}`;
                  }}>
                    مشاهده
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function BottomNav({ current, onNav }){
  return (
    <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg px-2 py-2 flex gap-1 z-50">
      {["home","loan","currency","date","age"].map(k => (
        <button key={k} onClick={()=>onNav(k)} className={`px-3 py-1.5 rounded-xl text-sm ${current===k?'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900':''}`}>{labelOfType(k)}</button>
      ))}
    </div>
  );
}

function labelOfType(t) {
  return (
    {
      loan: "قسط و وام",
      salary: "حقوق و اضافه‌کاری",
      bmi: "BMI",
      vat: "مالیات ارزش افزوده",
      convert: "تبدیل واحد",
      date: "تبدیل تاریخ",
      age: "سن",
      discount: "تخفیف",
      currency: "نرخ ارز",
      bill: "تقسیم صورتحساب",
      bmr: "BMR/کالری",
      home: "خانه"
    }[t] || t
  );
}
