import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  type: string;
  industry: string;
  acvRange: string;
  revenue: number;
  teamId: string;
}

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await axios.get('http://localhost:8000/api/customers');
    return response.data;
  }
);

export const fetchCustomersByType = createAsyncThunk(
  'customers/fetchCustomersByType',
  async (type: string) => {
    const response = await axios.get(`http://localhost:8000/api/customers/type/${type}`);
    return response.data;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      .addCase(fetchCustomersByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersByType.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomersByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers by type';
      });
  },
});

export default customersSlice.reducer; 