import { useAppDispatch, useAppSelector } from '../hooks';
import { deleteService, startEditing } from '../features/services/servicesSlice';
import { selectSearchTerm } from '../features/services/selectors';
import styles from './ServiceItem.module.css';

interface ServiceItemProps {
  service: {
    id: string;
    name: string;
    price: number;
  };
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);

  const handleEdit = () => {
    dispatch(startEditing(service));
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить услугу "${service.name}"?`)) {
      dispatch(deleteService(service.id));
    }
  };

  // Подсветка найденных символов
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <li 
      id={`service-${service.id}`}  // 👈 Добавляем ID для якоря
      className={styles.serviceItem}
    >
      <div className={styles.serviceInfo}>
        <span className={styles.serviceName}>
          {highlightText(service.name, searchTerm)}
        </span>
        <span className={styles.servicePrice}>{service.price} ₽</span>
      </div>
      <div className={styles.actions}>
        <button onClick={handleEdit} className={styles.editButton}>
          Редактировать
        </button>
        <button onClick={handleDelete} className={styles.deleteButton}>
          ✕
        </button>
      </div>
    </li>
  );
};

export default ServiceItem;