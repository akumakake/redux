import { useAppDispatch, useAppSelector } from '../hooks';
import {
  setFormField,
  addService,
  updateService,
  cancelEditing,
  setValidationErrors,
  validateForm,
} from '../features/services/servicesSlice';
import styles from './ServiceForm.module.css';

const ServiceForm = () => {
  const dispatch = useAppDispatch();
  const { name, price, editingId, errors } = useAppSelector(
    (state) => state.services.form
  );
  const items = useAppSelector((state) => state.services.items);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(name, price);
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setValidationErrors(validationErrors));
      return;
    }

    const priceNum = Number(price);

    if (editingId) {
      dispatch(
        updateService({
          id: editingId,
          name: name.trim(),
          price: priceNum,
        })
      );
    } else {
      dispatch(addService({ name: name.trim(), price: priceNum }));
    }
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
  };

  const editingService = items.find((s) => s.id === editingId);

  return (
    <div className={styles.form}>
      <h2 className={`${styles.formTitle} ${editingId ? styles.formTitleEditing : ''}`}>
        {editingId ? (
          <>
            Редактирование услуги:{' '}
            <span className={styles.editingServiceName}>{editingService?.name}</span>
          </>
        ) : (
          'Добавление услуги'
        )}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Название услуги:
            <input
              type="text"
              value={name}
              onChange={(e) =>
                dispatch(setFormField({ field: 'name', value: e.target.value }))
              }
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            />
          </label>
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Цена:
            <input
              type="text"
              value={price}
              onChange={(e) =>
                dispatch(setFormField({ field: 'price', value: e.target.value }))
              }
              className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            />
          </label>
          {errors.price && (
            <span className={styles.errorMessage}>{errors.price}</span>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            className={`${styles.saveButton} ${
              editingId ? styles.saveButtonEdit : styles.saveButtonAdd
            }`}
          >
            {editingId ? 'Обновить' : 'Сохранить'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <p className={styles.stats}>
        Всего услуг: <span className={styles.statsCount}>{items.length}</span>
      </p>
    </div>
  );
};

export default ServiceForm;