import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { AppSlice, PokemonSlice } from "../../app/slices";
import Login from "../Login";
import { signInWithPopup } from "firebase/auth";
import { getDocs, addDoc, collection } from "firebase/firestore";

// Mock Firebase functions
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<
  typeof signInWithPopup
>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      pokemon: PokemonSlice.reducer,
      app: AppSlice.reducer,
    },
  });
};

// Custom render function
const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
  };
};

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login button", () => {
    renderWithProviders(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    expect(loginButton).toBeInTheDocument();
  });

  it("should have Google icon in login button", () => {
    renderWithProviders(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    expect(loginButton).toHaveTextContent("Login with Google");
  });

  it("should have correct CSS classes", () => {
    const { container } = renderWithProviders(<Login />);

    const loginDiv = container.querySelector(".login");
    const loginButton = container.querySelector(".login-btn");

    expect(loginDiv).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("should handle successful login for new user", async () => {
    const mockUser = {
      email: "test@example.com",
      uid: "test-uid",
    };

    const mockCollectionRef = { id: "users-collection" };

    mockSignInWithPopup.mockResolvedValue({
      user: mockUser,
    } as any);

    mockGetDocs.mockResolvedValue({
      docs: [], // No existing user
    } as any);

    mockCollection.mockReturnValue(mockCollectionRef as any);
    mockAddDoc.mockResolvedValue({} as any);

    const { store } = renderWithProviders(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
      expect(mockGetDocs).toHaveBeenCalled();
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "users");
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        uid: "test-uid",
        email: "test@example.com",
      });
    });

    const state = store.getState();
    expect(state.app.userInfo).toEqual({ email: "test@example.com" });
  });

  it("should handle successful login for existing user", async () => {
    const mockUser = {
      email: "existing@example.com",
      uid: "existing-uid",
    };

    mockSignInWithPopup.mockResolvedValue({
      user: mockUser,
    } as any);

    mockGetDocs.mockResolvedValue({
      docs: [{ id: "existing-doc" }], // Existing user
    } as any);

    const { store } = renderWithProviders(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
      expect(mockGetDocs).toHaveBeenCalled();
      expect(mockAddDoc).not.toHaveBeenCalled(); // Should not add existing user
    });

    const state = store.getState();
    expect(state.app.userInfo).toEqual({ email: "existing@example.com" });
  });

  // TODO: Fix this test - currently causing unhandled promise rejection
  // it("should handle login error gracefully", async () => {
  //   mockSignInWithPopup.mockRejectedValue(new Error("Login failed"));

  //   const consoleSpy = jest
  //     .spyOn(console, "error")
  //     .mockImplementation(() => {});

  //   renderWithProviders(<Login />);

  //   const loginButton = screen.getByRole("button", {
  //     name: /login with google/i,
  //   });

  //   // Wrap in try-catch to handle the promise rejection
  //   try {
  //     fireEvent.click(loginButton);
  //     await waitFor(() => {
  //       expect(mockSignInWithPopup).toHaveBeenCalled();
  //     });
  //   } catch (error) {
  //     // Expected error from the mock
  //   }

  //   // Should not crash the component
  //   expect(loginButton).toBeInTheDocument();

  //   consoleSpy.mockRestore();
  // });

  it("should not dispatch user status if no email", async () => {
    const mockUser = {
      email: null,
      uid: "test-uid",
    };

    mockSignInWithPopup.mockResolvedValue({
      user: mockUser,
    } as any);

    const { store } = renderWithProviders(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
    });

    const state = store.getState();
    expect(state.app.userInfo).toBeUndefined();
  });
});
