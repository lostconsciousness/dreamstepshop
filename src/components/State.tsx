type StateProps = {
  title: string;
  message?: string;
  emoji?: string;
  actions?: React.ReactNode;
};

export const StateBlock = ({ title, message, emoji, actions }: StateProps) => {
  return (
    <section className="state-block">
      {emoji ? <div className="state-emoji" aria-hidden>{emoji}</div> : null}
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {actions ? <div className="state-actions">{actions}</div> : null}
    </section>
  );
};

export const CatalogSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, idx) => (
      <div className="skeleton-card" key={idx}>
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    ))}
  </div>
);
