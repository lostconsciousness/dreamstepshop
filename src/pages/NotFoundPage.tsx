import { Link } from 'react-router-dom';
import { StateBlock } from '../components/State';
import { useI18n } from '../i18n';

export const NotFoundPage = () => {
  const { t } = useI18n();

  return (
    <StateBlock
      emoji="👀"
      title={t.notFound}
      message={t.notFoundHint}
      actions={
        <Link to="/" className="btn btn-primary">
          {t.toHome}
        </Link>
      }
    />
  );
};
