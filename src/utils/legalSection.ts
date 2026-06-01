export const sectionAnchor = (title: string): string =>
  title
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const sectionLabel = (title: string): string => title.replace(/^\d+\.\s*/, '');
