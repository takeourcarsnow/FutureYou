import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function getStatColor(value: number): string {
  if (value >= 80) return 'text-success-500';
  if (value >= 60) return 'text-primary-500';
  if (value >= 40) return 'text-warning-500';
  return 'text-danger-500';
}

export function getStatBgColor(value: number): string {
  if (value >= 80) return 'bg-success-500';
  if (value >= 60) return 'bg-primary-500';
  if (value >= 40) return 'bg-warning-500';
  return 'bg-danger-500';
}

export function getStatGradient(value: number): string {
  if (value >= 80) return 'from-success-400 to-success-600';
  if (value >= 60) return 'from-primary-400 to-primary-600';
  if (value >= 40) return 'from-warning-400 to-warning-600';
  return 'from-danger-400 to-danger-600';
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'money':
      return '💰';
    case 'health':
      return '❤️';
    case 'career':
      return '💼';
    case 'relationships':
      return '👥';
    case 'life':
      return '✨';
    default:
      return '📌';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'money':
      return 'bg-emerald-500';
    case 'health':
      return 'bg-rose-500';
    case 'career':
      return 'bg-blue-500';
    case 'relationships':
      return 'bg-purple-500';
    case 'life':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'positive':
      return 'text-success-500 bg-success-50 dark:bg-success-900/30';
    case 'negative':
      return 'text-danger-500 bg-danger-50 dark:bg-danger-900/30';
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-800/50';
  }
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low':
      return 'text-success-600 bg-success-100 dark:bg-success-900/40';
    case 'medium':
      return 'text-warning-600 bg-warning-100 dark:bg-warning-900/40';
    case 'high':
      return 'text-danger-600 bg-danger-100 dark:bg-danger-900/40';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
