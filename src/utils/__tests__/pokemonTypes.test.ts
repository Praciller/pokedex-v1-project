import { pokemonTypes } from '../pokemonTypes';

describe('pokemonTypes utility', () => {
  it('should contain all 18 Pokemon types', () => {
    const expectedTypes = [
      'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
      'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
      'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
    ];

    expectedTypes.forEach(type => {
      expect(pokemonTypes).toHaveProperty(type);
    });

    expect(Object.keys(pokemonTypes)).toHaveLength(18);
  });

  it('should have correct structure for each type', () => {
    Object.values(pokemonTypes).forEach(type => {
      expect(type).toHaveProperty('image');
      expect(type).toHaveProperty('strength');
      expect(type).toHaveProperty('weakness');
      expect(type).toHaveProperty('resistance');
      expect(type).toHaveProperty('vulnerable');

      expect(Array.isArray(type.strength)).toBe(true);
      expect(Array.isArray(type.weakness)).toBe(true);
      expect(Array.isArray(type.resistance)).toBe(true);
      expect(Array.isArray(type.vulnerable)).toBe(true);
    });
  });

  it('should have fire type with correct properties', () => {
    const fireType = pokemonTypes.fire;
    
    expect(fireType.strength).toContain('grass');
    expect(fireType.strength).toContain('ice');
    expect(fireType.strength).toContain('bug');
    expect(fireType.strength).toContain('steel');

    expect(fireType.weakness).toContain('water');
    expect(fireType.weakness).toContain('rock');

    expect(fireType.vulnerable).toContain('water');
    expect(fireType.vulnerable).toContain('ground');
    expect(fireType.vulnerable).toContain('rock');
  });

  it('should have water type with correct properties', () => {
    const waterType = pokemonTypes.water;
    
    expect(waterType.strength).toContain('fire');
    expect(waterType.strength).toContain('ground');
    expect(waterType.strength).toContain('rock');

    expect(waterType.weakness).toContain('grass');
    expect(waterType.weakness).toContain('dragon');

    expect(waterType.vulnerable).toContain('grass');
    expect(waterType.vulnerable).toContain('electric');
  });

  it('should have grass type with correct properties', () => {
    const grassType = pokemonTypes.grass;
    
    expect(grassType.strength).toContain('water');
    expect(grassType.strength).toContain('ground');
    expect(grassType.strength).toContain('rock');

    expect(grassType.weakness).toContain('fire');
    expect(grassType.weakness).toContain('flying');
    expect(grassType.weakness).toContain('poison');

    expect(grassType.vulnerable).toContain('fire');
    expect(grassType.vulnerable).toContain('ice');
    expect(grassType.vulnerable).toContain('flying');
  });

  it('should have normal type with empty strength array', () => {
    const normalType = pokemonTypes.normal;
    
    expect(normalType.strength).toHaveLength(0);
    expect(normalType.vulnerable).toContain('fighting');
  });

  it('should have steel type with extensive resistance', () => {
    const steelType = pokemonTypes.steel;
    
    // Steel type is known for having many resistances
    expect(steelType.resistance.length).toBeGreaterThan(10);
    expect(steelType.resistance).toContain('normal');
    expect(steelType.resistance).toContain('flying');
    expect(steelType.resistance).toContain('poison');
    expect(steelType.resistance).toContain('psychic');
  });
});
