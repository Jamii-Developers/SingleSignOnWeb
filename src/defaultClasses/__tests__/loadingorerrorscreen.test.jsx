import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingOrErrorScreen from '../loadingorerrorscreen';

describe('LoadingOrErrorScreen component', () => {
    describe('error state', () => {
        it('renders error message when serverError is provided', () => {
            render(<LoadingOrErrorScreen serverError="Server is down" serverReady={false} showSuccessMessage={false} />);
            expect(screen.getByText('Server is down')).toBeInTheDocument();
        });

        it('shows error emoji in error state', () => {
            const { container } = render(
                <LoadingOrErrorScreen serverError="Error occurred" serverReady={false} showSuccessMessage={false} />
            );
            expect(container.textContent).toContain('🚨');
        });

        it('renders status check link in error state', () => {
            render(<LoadingOrErrorScreen serverError="Error occurred" serverReady={false} showSuccessMessage={false} />);
            const link = screen.getByRole('link', { name: /here/i });
            expect(link).toHaveAttribute('href', 'https://stats.uptimerobot.com/lVPlTGKPh4');
            expect(link).toHaveAttribute('target', '_blank');
        });
    });

    describe('loading state', () => {
        it('shows connecting message when not ready and no error', () => {
            render(<LoadingOrErrorScreen serverError={null} serverReady={false} showSuccessMessage={false} />);
            expect(screen.getByText(/Connecting to/)).toBeInTheDocument();
            expect(screen.getByText('Jamiix')).toBeInTheDocument();
        });

        it('shows success message when showSuccessMessage is true', () => {
            render(<LoadingOrErrorScreen serverError={null} serverReady={false} showSuccessMessage={true} />);
            expect(screen.getByText(/Connected Successfully/)).toBeInTheDocument();
        });

        it('does not show loader bar when success message is displayed', () => {
            const { container } = render(
                <LoadingOrErrorScreen serverError={null} serverReady={false} showSuccessMessage={true} />
            );
            // The loader bar has a specific style
            const loaderBars = container.querySelectorAll('[style*="overflow: hidden"]');
            expect(loaderBars.length).toBe(0);
        });
    });

    describe('ready state', () => {
        it('renders nothing when serverReady is true', () => {
            const { container } = render(
                <LoadingOrErrorScreen serverError={null} serverReady={true} showSuccessMessage={false} />
            );
            expect(container.innerHTML).toBe('');
        });
    });

    describe('priority of states', () => {
        it('error state takes priority over loading state', () => {
            render(<LoadingOrErrorScreen serverError="Error!" serverReady={false} showSuccessMessage={false} />);
            expect(screen.getByText('Error!')).toBeInTheDocument();
            expect(screen.queryByText(/Connecting to/)).not.toBeInTheDocument();
        });
    });
});
