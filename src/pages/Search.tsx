// @ts-nocheck

import React, { useEffect, useMemo, useCallback } from "react";
import Wrapper from "../sections/Wrapper";
import { debounce } from "../utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getInitialPokemonData } from "../app/reducers/getInitialPokemonData";
import { getPokemonsData } from "../app/reducers/getPokemonsData";
import Loader from "../components/Loader";
import { setLoading } from "../app/slices/AppSlice";

import PokemonCardGrid from "../components/PokemonCardGrid";

function Search() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(({ app: { isLoading } }) => isLoading);
  const { allPokemon, randomPokemons } = useAppSelector(
    ({ pokemon }) => pokemon
  );

  // Memoize the getPokemon function to prevent unnecessary re-creations
  const getPokemon = useCallback(
    async (value: string) => {
      if (value.length) {
        const pokemons = allPokemon.filter((pokemon) =>
          pokemon.name.includes(value.toLowerCase())
        );
        dispatch(getPokemonsData(pokemons));
      } else {
        const clonedPokemons = [...allPokemon];
        const randomPokemonsId = clonedPokemons
          .sort(() => Math.random() - Math.random())
          .slice(0, 20);
        dispatch(getPokemonsData(randomPokemonsId));
      }
    },
    [allPokemon, dispatch]
  );

  // Memoize the debounced handler
  const handleChange = useMemo(
    () => debounce((value: string) => getPokemon(value), 300),
    [getPokemon]
  );

  useEffect(() => {
    dispatch(getInitialPokemonData());
  }, [dispatch]);

  useEffect(() => {
    if (allPokemon) {
      const clonedPokemons = [...allPokemon];
      const randomPokemonsId = clonedPokemons
        .sort(() => Math.random() - Math.random())
        .slice(0, 20);
      dispatch(getPokemonsData(randomPokemonsId));
    }
  }, [allPokemon, dispatch]);

  useEffect(() => {
    if (randomPokemons) {
      dispatch(setLoading(false));
    }
  }, [randomPokemons, dispatch]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="search">
          <input
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            className="pokemon-searchbar"
            placeholder="Search Pokemon"
          />
          <PokemonCardGrid pokemons={randomPokemons} />
        </div>
      )}
    </>
  );
}

export default Wrapper(Search);
