type IconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean;
};

export const Icon = ({ name, className, style, ...rest }: IconProps) => {
  const classes = ['lni', `lni-${name}`, className].filter(Boolean).join(' ');
  return <i className={classes} style={style} aria-hidden={rest['aria-hidden'] ?? true} />;
};
