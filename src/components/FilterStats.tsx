import { useAppSelector } from '../hooks';
import { selectFilterStats } from '../features/services/selectors';
import styles from './FilterStats.module.css';

const FilterStats = () => {
  const { found, total } = useAppSelector(selectFilterStats);

  if (total === 0) {
    return <p className={styles.statsEmpty}>Нет услуг</p>;
  }

  return (
    <p className={styles.stats}>
      Найдено: <span className={styles.count}>{found}</span> из {total} услуг
    </p>
  );
};

export default FilterStats;