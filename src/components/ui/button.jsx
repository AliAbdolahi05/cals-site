
import React from "react";
export function Button({ className="", variant="default", size="md", ...props }){
  const base = "inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-xl transition";
  const variantCls = variant==="secondary" ? "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700"
    : variant==="outline" ? "border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
    : variant==="ghost" ? "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
    : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
  return <button className={`${base} ${variantCls} ${className}`} {...props} />;
}
