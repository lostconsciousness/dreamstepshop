import type { LegalSection } from '../content/legalTypes';
import { sectionAnchor } from '../utils/legalSection';

type LegalSectionBlockProps = {
  section: LegalSection;
  className?: string;
};

export const LegalSectionBlock = ({ section, className }: LegalSectionBlockProps) => {
  const anchor = sectionAnchor(section.title);
  const paragraphs = section.paragraphs ?? [];
  const leadParagraph = section.list ? paragraphs.slice(0, 1) : paragraphs;
  const trailingParagraphs = section.list ? paragraphs.slice(1) : [];

  return (
    <section id={anchor} className={className}>
      <h2>{section.title}</h2>
      {leadParagraph.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
      {section.list ? (
        <ul>
          {section.list.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      ) : null}
      {trailingParagraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </section>
  );
};
