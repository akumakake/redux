import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setSearchTerm, clearSearch } from '../features/services/servicesSlice';
import { selectSearchTerm, selectFilteredServices } from '../features/services/selectors';
import styles from './SearchFilter.module.css';

const SearchFilter = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const filteredServices = useAppSelector(selectFilteredServices);
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearchTerm));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, dispatch]);

  // Открываем дропдаун при вводе
  useEffect(() => {
    if (localSearchTerm.trim() && filteredServices.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [localSearchTerm, filteredServices]);

  // Закрываем дропдаун при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalSearchTerm('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectService = (serviceId: string) => {
    const element = document.getElementById(`service-${serviceId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.transition = 'background-color 0.5s';
      element.style.backgroundColor = '#fff3cd';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
    setIsDropdownOpen(false);
    setLocalSearchTerm('');
    dispatch(clearSearch());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredServices.length) {
          handleSelectService(filteredServices[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        break;
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchWrapper}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск услуг..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (localSearchTerm.trim() && filteredServices.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          className={styles.input}
          aria-autocomplete="list"
          aria-expanded={isDropdownOpen}
        />
        {localSearchTerm && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      {isDropdownOpen && filteredServices.length > 0 && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <div className={styles.dropdownHeader}>
            <span>Найдено {filteredServices.length} услуг</span>
            <span className={styles.dropdownHint}>↑↓ Enter для выбора</span>
          </div>
          <ul className={styles.dropdownList}>
            {filteredServices.map((service, index) => (
              <li
                key={service.id}
                className={`${styles.dropdownItem} ${
                  index === highlightedIndex ? styles.dropdownItemHighlighted : ''
                }`}
                onClick={() => handleSelectService(service.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                <span className={styles.dropdownItemName}>
                  {service.name}  {}
                </span>
                <span className={styles.dropdownItemPrice}>{service.price} ₽</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;