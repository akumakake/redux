import { createSelector } from 'reselect';
import { RootState } from '../../app/store';

// Базовые селекторы
export const selectServices = (state: RootState) => state.services.items;
export const selectSearchTerm = (state: RootState) => state.services.filter.searchTerm;
export const selectForm = (state: RootState) => state.services.form;

// Мемоизированный селектор для отфильтрованных услуг
export const selectFilteredServices = createSelector(
  [selectServices, selectSearchTerm],
  (services, searchTerm) => {
    if (!searchTerm.trim()) {
      return services;
    }
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return services.filter((service) =>
      service.name.toLowerCase().includes(lowerSearchTerm)
    );
  }
);

// Селектор для статистики
export const selectFilterStats = createSelector(
  [selectFilteredServices, selectServices],
  (filteredServices, allServices) => ({
    found: filteredServices.length,
    total: allServices.length,
  })
);

// Селектор для проверки, есть ли результаты
export const selectHasFilteredResults = createSelector(
  [selectFilteredServices],
  (filteredServices) => filteredServices.length > 0
);