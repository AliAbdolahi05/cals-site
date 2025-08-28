
import React from "react";
export function Input({ className="", ...props }){
  return <input className={`w-full mt-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 ${className}`} {...props} />;
}
