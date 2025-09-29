import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader component', () => {
  it('should render loader image', () => {
    render(<Loader />);
    
    const loaderImage = screen.getByRole('img');
    expect(loaderImage).toBeInTheDocument();
    expect(loaderImage).toHaveAttribute('alt', '');
  });

  it('should have correct CSS class', () => {
    const { container } = render(<Loader />);
    
    const loaderDiv = container.querySelector('.loader');
    expect(loaderDiv).toBeInTheDocument();
  });

  it('should render pokeball loader gif', () => {
    render(<Loader />);
    
    const loaderImage = screen.getByRole('img');
    expect(loaderImage.getAttribute('src')).toContain('pokeball-loader.gif');
  });

  it('should match snapshot', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
