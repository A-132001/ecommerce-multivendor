import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrency } from "../api/api.js";

export const fetchCurrency = createAsyncThunk('currency/fetch', async () => {
    try {
        const res = await getCurrency()
        const {data} = res;
        return data.currency;
    } catch (error) {
        console.log(error)
        throw error
    }
});

const currencySlice = createSlice({
    name: 'currency',
    initialState: {
        value: '',
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrency.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrency.fulfilled, (state, action) => {
                state.value = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCurrency.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default currencySlice.reducer;
