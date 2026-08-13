import { useAppSelector } from '../hooks';
import ServiceItem from './ServiceItem';
import {
  selectFilteredServices,
  selectHasFilteredResults,
} from '../features/services/selectors';
import styles from './ServiceList.module.css';

const ServiceList = () => {
  const filteredServices = useAppSelector(selectFilteredServices);
  const hasResults = useAppSelector(selectHasFilteredResults);

  if (filteredServices.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📭</div>
        {hasResults ? 'Нет добавленных услуг' : 'Услуги не найдены'}
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {filteredServices.map((service) => (
        <ServiceItem key={service.id} service={service} />
      ))}
    </ul>
  );
};

export default ServiceList;