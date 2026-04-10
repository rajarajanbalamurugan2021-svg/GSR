/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Search, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled, 
  type = 'button',
  icon: Icon
}: { 
  children?: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'info', 
  size?: 'sm' | 'md' | 'lg', 
  className?: string, 
  disabled?: boolean,
  type?: 'button' | 'submit',
  icon?: any,
  key?: any
}) {
  const variants = {
    primary: "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-dark",
    secondary: "bg-info text-white shadow-lg shadow-info/20 hover:bg-info/80",
    danger: "bg-danger text-white shadow-lg shadow-danger/20 hover:bg-danger/80",
    success: "bg-success text-white shadow-lg shadow-success/20 hover:bg-success/80",
    ghost: "bg-transparent text-text-muted hover:bg-card-hover hover:text-text",
    outline: "bg-transparent border-2 border-border text-text-muted hover:border-accent hover:text-accent",
    info: "bg-info text-white shadow-lg shadow-info/20 hover:bg-info/80"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className={cn(size === 'sm' ? "w-3.5 h-3.5" : "w-4 h-4")} />}
      {children}
    </button>
  );
}

export function Badge({ label, variant = 'info' }: { label: string, variant?: 'info' | 'success' | 'danger' | 'warning' | 'orange' | 'purple', key?: any }) {
  const variants = {
    info: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    warning: "bg-warning/10 text-warning",
    orange: "bg-orange/10 text-orange",
    purple: "bg-info/10 text-info"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {label}
    </span>
  );
}

export function Input({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  options,
  className
}: { 
  label: string, 
  id: string, 
  type?: string, 
  value: any, 
  onChange: (e: any) => void, 
  placeholder?: string, 
  required?: boolean,
  options?: { v: any, l: string }[] | string[],
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {options ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full bg-input border-2 border-input-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors cursor-pointer appearance-none"
          required={required}
        >
          <option value="">— Select —</option>
          {options.map(o => {
            const v = typeof o === 'object' ? o.v : o;
            const l = typeof o === 'object' ? o.l : o;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-input border-2 border-input-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          required={required}
        />
      )}
    </div>
  );
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  wide = false 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode, 
  wide?: boolean 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              wide ? "max-w-3xl" : "max-w-lg"
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-card-hover text-text-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Table({ 
  headers, 
  rows 
}: { 
  headers: string[], 
  rows: React.ReactNode[][] 
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-bg/50">
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length > 0 ? rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-card-hover transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-6 py-4 text-sm font-medium text-text-sub align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-text-muted italic text-sm">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function SectionHeader({ 
  title, 
  subtitle, 
  action 
}: { 
  title: string, 
  subtitle: string, 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        <p className="text-text-muted text-sm">{subtitle}</p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
