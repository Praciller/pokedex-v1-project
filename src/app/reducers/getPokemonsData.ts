// @ts-nocheck

import { createAsyncThunk } from "@reduxjs/toolkit";
import { cachedAxios } from "../../utils/cachedAxios";
import { pokemonTypes } from "../../utils";
import { generatedPokemonType, genericPokemonType } from "../../utils/types";

export const getPokemonsData = createAsyncThunk(
  "pokemon/randomPokemon",
  async (pokemons: genericPokemonType[]) => {
    try {
      // Use Promise.all for parallel API calls instead of sequential
      const pokemonPromises = pokemons.map(async (pokemon) => {
        try {
          const {
            data,
          }: {
            data: {
              id: number;
              types: { type: genericPokemonType }[];
            };
          } = await cachedAxios.get(pokemon.url);

          const types = data.types.map(
            ({ type: { name } }: { type: { name: string } }) => ({
              [name]: pokemonTypes[name],
            })
          );

          return {
            name: pokemon.name,
            id: data.id,
            image: "", // Empty string - LazyImage will handle loading
            types,
          };
        } catch (error) {
          console.error(`Failed to fetch data for ${pokemon.name}:`, error);
          return null; // Return null for failed requests
        }
      });

      const results = await Promise.all(pokemonPromises);
      // Filter out null results (failed requests)
      const pokemonsData = results.filter(
        (pokemon) => pokemon !== null
      ) as generatedPokemonType[];

      return pokemonsData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);
