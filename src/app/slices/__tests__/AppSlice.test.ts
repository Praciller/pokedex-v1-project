import { AppSlice, setLoading, setUserStatus, setToast, clearToasts, setPokemonTab } from '../AppSlice';
import { pokemonTabs } from '../../../utils/constants';

describe('AppSlice', () => {
  const initialState = {
    isLoading: true,
    userInfo: undefined,
    toasts: [],
    currentPokemonTab: pokemonTabs.description,
  };

  it('should return the initial state', () => {
    expect(AppSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const actual = AppSlice.reducer(initialState, setLoading(false));
    expect(actual.isLoading).toEqual(false);
  });

  it('should handle setUserStatus with user info', () => {
    const userInfo = { email: 'test@example.com' };
    const actual = AppSlice.reducer(initialState, setUserStatus(userInfo));
    expect(actual.userInfo).toEqual(userInfo);
  });

  it('should handle setUserStatus with undefined (logout)', () => {
    const stateWithUser = {
      ...initialState,
      userInfo: { email: 'test@example.com' },
    };
    const actual = AppSlice.reducer(stateWithUser, setUserStatus(undefined));
    expect(actual.userInfo).toBeUndefined();
  });

  it('should handle setToast by adding toast to array', () => {
    const toastMessage = 'Test toast message';
    const actual = AppSlice.reducer(initialState, setToast(toastMessage));
    expect(actual.toasts).toEqual([toastMessage]);
  });

  it('should handle multiple toasts', () => {
    const firstToast = 'First toast';
    const secondToast = 'Second toast';
    
    let state = AppSlice.reducer(initialState, setToast(firstToast));
    state = AppSlice.reducer(state, setToast(secondToast));
    
    expect(state.toasts).toEqual([firstToast, secondToast]);
  });

  it('should handle clearToasts', () => {
    const stateWithToasts = {
      ...initialState,
      toasts: ['Toast 1', 'Toast 2', 'Toast 3'],
    };
    const actual = AppSlice.reducer(stateWithToasts, clearToasts());
    expect(actual.toasts).toEqual([]);
  });

  it('should handle setPokemonTab', () => {
    const actual = AppSlice.reducer(initialState, setPokemonTab(pokemonTabs.evolution));
    expect(actual.currentPokemonTab).toEqual(pokemonTabs.evolution);
  });

  it('should handle setPokemonTab with different tabs', () => {
    const tabs = [
      pokemonTabs.description,
      pokemonTabs.evolution,
      pokemonTabs.locations,
      pokemonTabs.moves,
    ];

    tabs.forEach(tab => {
      const actual = AppSlice.reducer(initialState, setPokemonTab(tab));
      expect(actual.currentPokemonTab).toEqual(tab);
    });
  });

  it('should maintain other state properties when updating one property', () => {
    const stateWithData = {
      isLoading: false,
      userInfo: { email: 'test@example.com' },
      toasts: ['Existing toast'],
      currentPokemonTab: pokemonTabs.evolution,
    };

    const actual = AppSlice.reducer(stateWithData, setLoading(true));
    
    expect(actual.isLoading).toBe(true);
    expect(actual.userInfo).toEqual(stateWithData.userInfo);
    expect(actual.toasts).toEqual(stateWithData.toasts);
    expect(actual.currentPokemonTab).toEqual(stateWithData.currentPokemonTab);
  });
});
