import { http, HttpResponse } from "msw";
import { pokemonAPI } from "../../utils/constants";

// Mock data
const mockPokemonList = {
  results: [
    { name: "bulbasaur", url: `${pokemonAPI}/pokemon/1/` },
    { name: "ivysaur", url: `${pokemonAPI}/pokemon/2/` },
    { name: "venusaur", url: `${pokemonAPI}/pokemon/3/` },
  ],
};

const mockPokemonData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    types: [
      {
        slot: 1,
        type: {
          name: "grass",
          url: `${pokemonAPI}/type/12/`,
        },
      },
    ],
    abilities: [
      {
        ability: {
          name: "overgrow",
          url: `${pokemonAPI}/ability/65/`,
        },
      },
    ],
    moves: [
      {
        move: {
          name: "tackle",
          url: `${pokemonAPI}/move/33/`,
        },
      },
    ],
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: {
          name: "hp",
          url: `${pokemonAPI}/stat/1/`,
        },
      },
    ],
    location_area_encounters: `${pokemonAPI}/pokemon/1/encounters`,
  },
};

const mockSpeciesData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "bulbasaur",
    evolution_chain: {
      url: `${pokemonAPI}/evolution-chain/1/`,
    },
    flavor_text_entries: [
      {
        flavor_text: "A strange seed was planted on its back at birth.",
        language: {
          name: "en",
        },
      },
    ],
  },
};

const mockEvolutionChain: { [key: string]: any } = {
  "1": {
    id: 1,
    chain: {
      species: {
        name: "bulbasaur",
        url: `${pokemonAPI}/pokemon-species/1/`,
      },
      evolves_to: [
        {
          species: {
            name: "ivysaur",
            url: `${pokemonAPI}/pokemon-species/2/`,
          },
          evolves_to: [
            {
              species: {
                name: "venusaur",
                url: `${pokemonAPI}/pokemon-species/3/`,
              },
              evolves_to: [],
            },
          ],
        },
      ],
    },
  },
};

export const handlers = [
  // Get all Pokemon list
  http.get(`${pokemonAPI}/pokemon`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "5000") {
      return HttpResponse.json(mockPokemonList);
    }

    return HttpResponse.json({
      results: mockPokemonList.results.slice(0, 20),
    });
  }),

  // Get specific Pokemon data
  http.get(`${pokemonAPI}/pokemon/:id`, ({ params }) => {
    const { id } = params;
    const pokemonData = mockPokemonData[id as string];

    if (pokemonData) {
      return HttpResponse.json(pokemonData);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // Get Pokemon species data
  http.get(`${pokemonAPI}/pokemon-species/:id`, ({ params }) => {
    const { id } = params;
    const speciesData = mockSpeciesData[id as string];

    if (speciesData) {
      return HttpResponse.json(speciesData);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // Get evolution chain data
  http.get(`${pokemonAPI}/evolution-chain/:id`, ({ params }) => {
    const { id } = params;
    const evolutionData = mockEvolutionChain[id as string];

    if (evolutionData) {
      return HttpResponse.json(evolutionData);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // Get Pokemon encounters
  http.get(`${pokemonAPI}/pokemon/:id/encounters`, () => {
    return HttpResponse.json([
      {
        location_area: {
          name: "pallet-town-area",
          url: `${pokemonAPI}/location-area/1/`,
        },
        version_details: [
          {
            max_chance: 10,
            encounter_details: [
              {
                min_level: 2,
                max_level: 4,
                condition_values: [],
                chance: 10,
                method: {
                  name: "walk",
                  url: `${pokemonAPI}/encounter-method/1/`,
                },
              },
            ],
            version: {
              name: "red",
              url: `${pokemonAPI}/version/1/`,
            },
          },
        ],
      },
    ]);
  }),
];
