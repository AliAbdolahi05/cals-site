
import React from "react";
export function Card({ className="", ...props }){ return <div className={`rounded-2xl ${className}`} {...props} /> }
export function CardHeader({ className="", ...props }){ return <div className={`p-4 border-b border-neutral-200/60 dark:border-neutral-800/60 ${className}`} {...props} /> }
export function CardTitle({ className="", ...props }){ return <div className={`font-bold ${className}`} {...props} /> }
export function CardContent({ className="", ...props }){ return <div className={`p-4 ${className}`} {...props} /> }
