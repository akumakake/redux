import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface ServicesState {
  items: Service[];
  filter: {
    searchTerm: string;
  };
  form: {
    name: string;
    price: string;
    editingId: string | null;
    errors: {
      name?: string;
      price?: string;
    };
  };
}

const initialState: ServicesState = {
  items: [],
  filter: {
    searchTerm: '',
  },
  form: {
    name: '',
    price: '',
    editingId: null,
    errors: {},
  },
};

export const validateForm = (name: string, price: string) => {
  const errors: { name?: string; price?: string } = {};
  if (!name.trim() || name.trim().length < 2) {
    errors.name = 'Название должно содержать минимум 2 символа';
  }
  const priceNum = Number(price);
  if (price.trim() === '' || isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Цена должна быть числом больше 0';
  }
  return errors;
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {

    addService: (state, action: PayloadAction<{ name: string; price: number }>) => {
      const newService: Service = {
        id: nanoid(),
        name: action.payload.name.trim(),
        price: action.payload.price,
      };
      state.items.push(newService);
      state.form.name = '';
      state.form.price = '';
      state.form.editingId = null;
      state.form.errors = {};
    },

    updateService: (
      state,
      action: PayloadAction<{ id: string; name: string; price: number }>
    ) => {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          id: action.payload.id,
          name: action.payload.name.trim(),
          price: action.payload.price,
        };
      }
      state.form.name = '';
      state.form.price = '';
      state.form.editingId = null;
      state.form.errors = {};
    },

    deleteService: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
      if (state.form.editingId === action.payload) {
        state.form.name = '';
        state.form.price = '';
        state.form.editingId = null;
        state.form.errors = {};
      }
    },

    setFormField: (
      state,
      action: PayloadAction<{ field: 'name' | 'price'; value: string }>
    ) => {
      const { field, value } = action.payload;
      state.form[field] = value;
      if (state.form.errors[field]) {
        delete state.form.errors[field];
      }
    },

    startEditing: (state, action: PayloadAction<Service>) => {
      const service = action.payload;
      state.form.name = service.name;
      state.form.price = String(service.price);
      state.form.editingId = service.id;
      state.form.errors = {};
    },

    cancelEditing: (state) => {
      state.form.name = '';
      state.form.price = '';
      state.form.editingId = null;
      state.form.errors = {};
    },

    clearForm: (state) => {
      state.form.name = '';
      state.form.price = '';
      state.form.editingId = null;
      state.form.errors = {};
    },

    setValidationErrors: (
      state,
      action: PayloadAction<{ name?: string; price?: string }>
    ) => {
      state.form.errors = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filter.searchTerm = action.payload;
    },

    clearSearch: (state) => {
      state.filter.searchTerm = '';
    },
  },
});

export const {
  addService,
  updateService,
  deleteService,
  setFormField,
  startEditing,
  cancelEditing,
  clearForm,
  setValidationErrors,
  setSearchTerm,      
  clearSearch,        
} = servicesSlice.actions;

export default servicesSlice.reducer;