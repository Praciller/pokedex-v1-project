// @ts-nocheck

import { useCallback, useEffect, useState } from "react";
import Wrapper from "../sections/Wrapper";
import { useParams } from "react-router-dom";
import { getImage } from "../utils/pokemonImages";
import { extractColors } from "extract-colors";
import axios from "axios";
import Evolution from "./Pokemon/Evolution";
import Locations from "./Pokemon/Locations";
import CapableMoves from "./Pokemon/CapableMoves";
import Description from "./Pokemon/Description";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPokemon } from "../app/slices/PokemonSlice";
import { setPokemonTab } from "../app/slices/AppSlice";
import Loader from "../components/Loader";
import {
  pokemonRoute,
  pokemonSpeciesRoute,
  pokemonTabs,
} from "../utils/constants";

function Pokemon() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const currentPokemonTab = useAppSelector(
    ({ app: { currentPokemonTab } }) => currentPokemonTab
  );
  const currentPokemon = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );

  useEffect(() => {
    dispatch(setPokemonTab(pokemonTabs.description));
  }, [dispatch]);

  const getRecursiveEvolution = useCallback(
    (evolutionChain, level, evolutionData) => {
      if (!evolutionChain.evolves_to.length) {
        return evolutionData.push({
          pokemon: {
            ...evolutionChain.species,
            url: evolutionChain.species.url.replace(
              "pokemon-species",
              "pokemon"
            ),
          },
          level,
        });
      }
      evolutionData.push({
        pokemon: {
          ...evolutionChain.species,
          url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
        },
        level,
      });
      return getRecursiveEvolution(
        evolutionChain.evolves_to[0],
        level + 1,
        evolutionData
      );
    },
    []
  );

  const getEvolutionData = useCallback(
    (evolutionChain) => {
      const evolutionData = [];
      getRecursiveEvolution(evolutionChain, 1, evolutionData);
      return evolutionData;
    },
    [getRecursiveEvolution]
  );

  const [isDataLoading, setIsDataLoading] = useState(true);
  const getPokemonInfo = useCallback(async () => {
    const { data } = await axios.get(`${pokemonRoute}/${params.id}`);
    const { data: dataEncounters } = await axios.get(
      data.location_area_encounters
    );

    const {
      data: {
        evolution_chain: { url: evolutionURL },
      },
    } = await axios.get(`${pokemonSpeciesRoute}/${data.id}`);
    const { data: evolutionData } = await axios.get(evolutionURL);

    const pokemonAbilities = {
      abilities: data.abilities.map(({ ability }) => ability.name),
      moves: data.moves.map(({ move }) => move.name),
    };

    const encounters = [];
    const evolution = getEvolutionData(evolutionData.chain);
    let evolutionLevel;
    evolutionLevel = evolution.find(
      ({ pokemon }) => pokemon.name === data.name
    ).level;
    dataEncounters.forEach((encounter) => {
      encounters.push(
        encounter.location_area.name.toUpperCase().split("-").join(" ")
      );
    });
    const stats = await data.stats.map(({ stat, base_stat }) => ({
      name: stat.name,
      value: base_stat,
    }));
    dispatch(
      setCurrentPokemon({
        id: data.id,
        name: data.name,
        types: data.types.map(({ type: { name } }) => name),
        image: "", // LazyImage will handle loading
        stats,
        encounters,
        evolutionLevel,
        evolution,
        pokemonAbilities,
      })
    );
    setIsDataLoading(false);
  }, [params.id, dispatch, getEvolutionData]);

  useEffect(() => {
    const loadPokemonData = async () => {
      // Load Pokemon data first
      await getPokemonInfo();

      // Load image for color extraction
      try {
        const imageUrl = await getImage(parseInt(params.id));
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;

        const options = {
          pixels: 10000,
          distance: 1,
          splitPower: 10,
          colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
          saturationDistance: 0.2,
          lightnessDistance: 0.2,
          hueDistance: 0.083333333,
        };

        const getColor = async () => {
          try {
            const color = await extractColors(imageElement.src, options);
            const root = document.documentElement;
            root.style.setProperty(
              "--accent-color",
              color[0].hex.split('"')[0]
            );
          } catch (error) {
            console.warn("Failed to extract colors:", error);
            // Set a default color if extraction fails
            const root = document.documentElement;
            root.style.setProperty("--accent-color", "#3b82f6");
          }
        };

        getColor();
      } catch (error) {
        console.warn("Failed to load image for color extraction:", error);
      }
    };

    loadPokemonData();
  }, [params.id, getPokemonInfo]);

  return (
    <>
      {!isDataLoading && currentPokemon ? (
        <>
          {currentPokemonTab === pokemonTabs.description && <Description />}
          {currentPokemonTab === pokemonTabs.evolution && <Evolution />}
          {currentPokemonTab === pokemonTabs.locations && <Locations />}
          {currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Wrapper(Pokemon);
