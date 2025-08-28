
// Minimal Jalaali (Shamsi) conversion utilities
function div(a, b){ return Math.floor(a / b); }

export function toJalaali(gy, gm, gd){
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy = (gy<=1600)?0:979;
  gy -= (gy<=1600)?621:1600;
  let gy2 = (gm>2)?(gy+1):gy;
  let days = 365*gy + div((gy2+3),4) - div((gy2+99),100) + div((gy2+399),400) - 80 + gd + g_d_m[gm-1];
  jy += 33*div(days,12053); days %= 12053;
  jy += 4*div(days,1461); days %= 1461;
  if (days > 365){
    jy += div((days-1),365);
    days = (days-1)%365;
  }
  const jm = (days<186)? 1+div(days,31): 7+div(days-186,30);
  const jd = 1 + ((days<186)? (days%31) : ((days-186)%30));
  return {jy, jm, jd};
}

export function toGregorian(jy, jm, jd){
  const gy = (jy<=979)?621:1600;
  jy -= (jy<=979)?0:979;
  let days = 365*jy + div(jy,33)*8 + div((jy%33)+3,4) + 78 + jd + ((jm<7)? (jm-1)*31 : ((jm-7)*30+186));
  let gy2 = gy + 400*div(days,146097); days %= 146097;
  let leap = true;
  if (days >= 36525){
    days--;
    gy2 += 100*div(days,36524); days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }
  gy2 += 4*div(days,1461); days %= 1461;
  if (days >= 366){
    leap = false;
    days--;
    gy2 += div(days,365);
    days %= 365;
  }
  const sal_a = [0,31,(leap?29:28),31,30,31,30,31,31,30,31,30,31];
  let gm = 0, gd = 0;
  for (gm=1; gm<=12 && days>=sal_a[gm]; gm++) days -= sal_a[gm];
  gd = days+1;
  return {gy: gy2, gm, gd};
}

// Approximate Hijri (±1 day)
export function gregorianToHijri(gy, gm, gd) {
  const jd = gregorianToJD(gy, gm, gd);
  const islamic = jdToIslamic(jd);
  return islamic; // {hy, hm, hd}
}

export function hijriToGregorian(hy, hm, hd){
  const jd = islamicToJD(hy, hm, hd);
  const g = jdToGregorian(jd);
  return g; // {gy, gm, gd}
}

function gregorianToJD(y,m,d){
  if(m<=2){ y-=1; m+=12; }
  const A = Math.floor(y/100);
  const B = 2 - A + Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5;
}
function jdToGregorian(jd){
  jd = jd + 0.5;
  const Z = Math.floor(jd), F = jd - Z;
  let A = Z;
  const alpha = Math.floor((Z - 1867216.25)/36524.25);
  A = Z + 1 + alpha - Math.floor(alpha/4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1)/365.25);
  const D = Math.floor(365.25*C);
  const E = Math.floor((B - D)/30.6001);
  const day = B - D - Math.floor(30.6001*E) + F;
  const month = (E<14)?E-1:E-13;
  const year = (month>2)?C-4716:C-4715;
  return {gy: year, gm: month, gd: Math.floor(day)};
}
function islamicToJD(y,m,d){
  return Math.floor((11*y + 3)/30) + 354*y + 30*m - Math.floor((m-1)/2) + d + 1948440 - 385 - 0.5;
}
function jdToIslamic(jd){
  jd = Math.floor(jd) + 0.5;
  const y = Math.floor((30*(jd - 1948439.5) + 10646) / 10631);
  const m = Math.min(12, Math.ceil((jd - (29 + islamicToJD(y,1,1))) / 29.5) + 1);
  const d = Math.floor(jd - islamicToJD(y, m, 1)) + 1;
  return {hy: y, hm: m, hd: d};
}
