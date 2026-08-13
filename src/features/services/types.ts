export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface ServicesState {
  items: Service[];
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