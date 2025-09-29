import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, query, where } from "firebase/firestore";
import { pokemonListRef } from "../../utils/firebaseConfig";
import { pokemonTypes } from "../../utils";
import { getImage } from "../../utils/pokemonImages";
import { RootState } from "../store";

export const getUserPokemons = createAsyncThunk(
  "pokemon/userList",
  async (args, { getState }) => {
    try {
      const {
        app: { userInfo },
      } = getState() as RootState;

      if (!userInfo?.email) {
        return [];
      }

      const firestoreQuery = query(
        pokemonListRef,
        where("email", "==", userInfo?.email)
      );

      const fetchedPokemons = await getDocs(firestoreQuery);

      if (fetchedPokemons.docs.length) {
        // Use Promise.all to handle async image loading properly
        const pokemonPromises = fetchedPokemons.docs.map(async (pokemon) => {
          const pokemons = await pokemon.data().pokemon;

          // Use the new getImage function for lazy loading
          const image = await getImage(pokemons.id, false);

          const types = pokemons.types.map((name: string) => ({
            // @ts-ignore
            [name]: pokemonTypes[name],
          }));

          return {
            ...pokemons,
            firebaseId: pokemon.id,
            image,
            types,
          };
        });

        const resolvedPokemons = await Promise.all(pokemonPromises);
        return resolvedPokemons;
      }

      return [];
    } catch (err) {
      return [];
    }
  }
);
