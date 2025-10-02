import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import CompareContainer from "../CompareContainer";
import { PokemonSlice } from "../../app/slices/PokemonSlice";
import { AppSlice } from "../../app/slices/AppSlice";
import { userPokemonsType } from "../../utils/types";

// Mock LazyImage component
jest.mock("../LazyImage", () => {
  return function MockLazyImage({ pokemonId, alt, className }: any) {
    return (
      <img
        src={`mock-image-${pokemonId}.png`}
        alt={alt}
        className={className}
        data-testid="lazy-image"
      />
    );
  };
});

const mockStore = configureStore({
  reducer: {
    pokemon: PokemonSlice.reducer,
    app: AppSlice.reducer,
  },
});

const mockPokemon: userPokemonsType = {
  id: 1,
  name: "bulbasaur",
  image: "", // Empty string - should be handled by LazyImage
  types: [
    {
      grass: {
        image: "grass-type.png",
        strength: ["water", "ground", "rock"],
        weakness: ["fire", "ice", "poison", "flying", "bug"],
        resistance: ["water", "electric", "grass", "fighting"],
        vulnerable: ["fire", "ice", "poison", "flying", "bug"],
      },
    },
  ],
};

describe("CompareContainer", () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  it("should render empty state when isEmpty is true", () => {
    renderWithProviders(<CompareContainer isEmpty={true} />);
    expect(screen.getByText("Add Pokemon for Comparison")).toBeInTheDocument();
  });

  it("should render pokemon with LazyImage component", () => {
    renderWithProviders(
      <CompareContainer pokemon={mockPokemon} isEmpty={false} />
    );

    // Check if pokemon name is displayed
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();

    // Check if LazyImage is rendered with correct props
    const lazyImage = screen.getByTestId("lazy-image");
    expect(lazyImage).toBeInTheDocument();
    expect(lazyImage).toHaveAttribute("src", "mock-image-1.png");
    expect(lazyImage).toHaveAttribute("alt", "bulbasaur");
    expect(lazyImage).toHaveClass("compare-image");
  });

  it("should render pokemon types", () => {
    renderWithProviders(
      <CompareContainer pokemon={mockPokemon} isEmpty={false} />
    );

    // Check if type section is displayed
    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    renderWithProviders(
      <CompareContainer pokemon={mockPokemon} isEmpty={false} />
    );

    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});
