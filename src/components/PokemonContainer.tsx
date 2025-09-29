import React from "react";
import LazyImage from "./LazyImage";
// import balbasaur from "../assets/balbasaur.png";
// import pikachu from "../assets/pikachu.png";
// import charlizard from "../assets/charlizard.png";

interface PokemonContainerProps {
  pokemonId: number;
  pokemonName: string;
}

export default function PokemonContainer({
  pokemonId,
  pokemonName,
}: PokemonContainerProps) {
  return (
    <>
      <div className="circle-container">
        <div className="outer-circle">
          <div className="inner-circle">
            <LazyImage
              pokemonId={pokemonId}
              alt={pokemonName}
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="lines">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
          </div>
        </div>
      </div>
      {/* <div className="circle-container circle-container-2">
        <div className="outer-circle">
          <div className="inner-circle">
            <img src={pikachu} alt="" />
          </div>
          <div className="lines">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
          </div>
        </div>
      </div>
      <div className="circle-container circle-container-3">
        <div className="outer-circle">
          <div className="inner-circle">
            <img src={charlizard} alt="" />
          </div>
          <div className="lines">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
          </div>
        </div>
      </div> */}
    </>
  );
}
