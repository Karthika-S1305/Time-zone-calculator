import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Country {
    id: number;
    name: string;
    flag: string;
    timezone: string;
}
 interface Time{
  country:string,
  time: string
 }

interface CountryState{
    allCountries: { name: string; flag: string}[];
    addedCountries: Country[];
    calculatedTimes: Time[];
    loading: boolean;
}

const initialState: CountryState = {
    allCountries: [],
    addedCountries: JSON.parse(localStorage.getItem('countries') || '[]'),
    calculatedTimes: JSON.parse(localStorage.getItem('calculatedTimes')|| '[]'),
    loading: false,
};

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags');
  console.log(response);
  return response.data.map((country: { name: { common: any; }; flags: { png: any; }; }) => ({
    name: country.name.common,
    flag: country.flags.png,
  }));
});

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    addCountry: (state, action: PayloadAction<Country>) => {
      state.addedCountries.push(action.payload);
    },
    setAddedCountries:(state, action: PayloadAction<Country[]>)=>{
      state.addedCountries = action.payload;
      localStorage.setItem("countries", JSON.stringify(action.payload));
    },
    setCalculatedTimes: (
      state,
      action: PayloadAction<Time[]>
      )=>{
      state.calculatedTimes = action.payload;
      localStorage.setItem("calculatedTimes", JSON.stringify(action.payload));
    },
    removeCountry: (
      state,
      action: PayloadAction<Country[]>)=>{
        state.addedCountries = action.payload;
      },
      removeCalculatedCountry:(
        state,
        action: PayloadAction<Time[]>)=>{
          state.calculatedTimes = action.payload;
        }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCountries.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.allCountries = action.payload;
        state.loading = false;
      })
  },
});

export const { addCountry, setAddedCountries, setCalculatedTimes, removeCountry, removeCalculatedCountry } = countrySlice.actions;
export default countrySlice.reducer;
