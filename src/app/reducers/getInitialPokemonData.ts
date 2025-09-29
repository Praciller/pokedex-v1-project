import { createAsyncThunk } from "@reduxjs/toolkit";
import { cachedAxios } from "../../utils/cachedAxios";
import { pokemonsRoute } from "../../utils/constants";

export const getInitialPokemonData = createAsyncThunk(
  "pokemon/initialData",
  async () => {
    try {
      // Cache for 30 minutes since Pokemon list doesn't change often
      const { data } = await cachedAxios.get(pokemonsRoute, 30 * 60 * 1000);
      return data.results;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);
