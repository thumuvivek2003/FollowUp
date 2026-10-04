/** Joins truthy class names: cn('a', cond && 'b') */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');
