
import React from "react";
export function Label({ className="", ...props }){
  return <label className={`text-xs text-neutral-600 dark:text-neutral-300 ${className}`} {...props} />;
}
