import { describe, it, expect } from 'vitest';

import { buttonClasses } from '@/components/ui/buttonClasses';

describe('buttonClasses', () => {
  it('includes accent background for the primary variant', () => {
    expect(buttonClasses({ variant: 'primary' })).toContain('bg-accent');
  });

  it('applies size classes', () => {
    expect(buttonClasses({ size: 'lg' })).toContain('h-14');
    expect(buttonClasses({ size: 'sm' })).toContain('h-9');
  });

  it('applies the cancelled treatment', () => {
    const cls = buttonClasses({ cancelled: true });
    expect(cls).toContain('line-through');
    expect(cls).toContain('pointer-events-none');
  });

  it('merges a custom className', () => {
    expect(buttonClasses({ className: 'w-full' })).toContain('w-full');
  });
});
