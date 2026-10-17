import { describe, expect, it } from 'vitest';
import { articles } from '@/lib/journal';

describe('journal', () => {
  it('has unique slugs and marks unreviewed articles as drafts', () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    for (const a of articles) {
      expect(['draft', 'published']).toContain(a.status);
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('cites sources with https links', () => {
    for (const a of articles) for (const s of a.sources) expect(s.href).toMatch(/^https:\/\//);
  });
});
