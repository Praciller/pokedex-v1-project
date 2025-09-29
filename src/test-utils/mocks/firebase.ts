// Mock Firebase Auth
export const mockFirebaseAuth = {
  currentUser: null,
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

// Mock Firestore
export const mockFirestore = {
  collection: jest.fn(() => ({
    add: jest.fn(),
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    where: jest.fn(() => ({
      get: jest.fn(),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn(),
    })),
    limit: jest.fn(() => ({
      get: jest.fn(),
    })),
  })),
};

// Mock Firebase functions
export const mockAddDoc = jest.fn();
export const mockGetDocs = jest.fn();
export const mockQuery = jest.fn();
export const mockWhere = jest.fn();
export const mockCollection = jest.fn();

// Mock user data
export const mockUserData = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
};

// Mock Pokemon list data
export const mockPokemonListData = [
  {
    id: '1',
    data: () => ({
      id: 1,
      name: 'bulbasaur',
      types: ['grass'],
      email: 'test@example.com',
    }),
  },
  {
    id: '2',
    data: () => ({
      id: 2,
      name: 'ivysaur',
      types: ['grass'],
      email: 'test@example.com',
    }),
  },
];

// Setup Firebase mocks
jest.mock('firebase/auth', () => ({
  getAuth: () => mockFirebaseAuth,
  signInWithPopup: mockFirebaseAuth.signInWithPopup,
  signOut: mockFirebaseAuth.signOut,
  onAuthStateChanged: mockFirebaseAuth.onAuthStateChanged,
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: () => mockFirestore,
  collection: mockCollection,
  addDoc: mockAddDoc,
  getDocs: mockGetDocs,
  query: mockQuery,
  where: mockWhere,
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
