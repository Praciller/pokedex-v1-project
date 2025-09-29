export const pokemonAPI = "https://pokeapi.co/api/v2";
// Reduced from 5000 to 1000 for better performance - can be increased later if needed
export const pokemonsRoute = `${pokemonAPI}/pokemon?limit=1000`;
export const pokemonRoute = `${pokemonAPI}/pokemon`;
export const pokemonSpeciesRoute = `${pokemonAPI}/pokemon-species`;

export const pokemonTabs = {
  description: "description",
  evolution: "evolution",
  locations: "locations",
  moves: "moves",
};
