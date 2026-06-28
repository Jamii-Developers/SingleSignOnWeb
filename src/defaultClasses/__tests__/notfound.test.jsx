import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../notfound';

describe('NotFound component', () => {
    const renderNotFound = () => {
        return render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
    };

    it('renders 404 heading', () => {
        renderNotFound();
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders descriptive message', () => {
        renderNotFound();
        expect(screen.getByText("Oops! The page you are looking for doesn't exist.")).toBeInTheDocument();
    });

    it('renders a link to home page', () => {
        renderNotFound();
        const link = screen.getByRole('link', { name: /go to home/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders h1 element with 404 text', () => {
        const { container } = renderNotFound();
        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
        expect(h1.textContent).toBe('404');
    });
});
