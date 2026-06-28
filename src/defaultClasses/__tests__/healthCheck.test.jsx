import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HealthCheck from '../healthCheck';

describe('HealthCheck component', () => {
    it('renders the health check heading', () => {
        render(<HealthCheck />);
        expect(screen.getByText('JamiiX - Health Check')).toBeInTheDocument();
    });

    it('shows OK status', () => {
        render(<HealthCheck />);
        expect(screen.getByText('Status: OK')).toBeInTheDocument();
    });

    it('renders within a div container', () => {
        const { container } = render(<HealthCheck />);
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders an h1 element for the title', () => {
        const { container } = render(<HealthCheck />);
        expect(container.querySelector('h1')).toBeInTheDocument();
    });
});
