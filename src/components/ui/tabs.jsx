
import React from "react";
export function Tabs({ value, onValueChange, children, className="" }){
  const ctx = { value, onValueChange };
  return <div className={className}>{React.Children.map(children, c=> React.cloneElement(c, { ctx }))}</div>;
}
export function TabsList({ children, className="" }){ return <div className={`grid gap-2 my-2 ${className}`}>{children}</div> }
export function TabsTrigger({ value, children, ctx }){
  const active = ctx?.value === value;
  return <button onClick={()=>ctx?.onValueChange(value)} className={`px-3 py-2 rounded-xl text-sm ${active?'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900':'bg-neutral-100 dark:bg-neutral-800'}`}>{children}</button>
}
export function TabsContent({ value, children, ctx }){ return ctx?.value===value ? <div className="mt-3">{children}</div> : null }
