import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServerErrorMsg from '../servererrormsg';

// Mock the sass import
vi.mock('../sass/servererrormsg.sass', () => ({}));

describe('ServerErrorMsg component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders modal with subject and message when show is true', () => {
        render(
            <ServerErrorMsg
                show={true}
                onClose={vi.fn()}
                subject="Error Title"
                message="Something went wrong"
            />
        );
        expect(screen.getByText('Error Title')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('does not render modal content when show is false', () => {
        render(
            <ServerErrorMsg
                show={false}
                onClose={vi.fn()}
                subject="Error Title"
                message="Something went wrong"
            />
        );
        expect(screen.queryByText('Error Title')).not.toBeInTheDocument();
    });

    it('renders Close buttons (header X and footer button)', () => {
        render(
            <ServerErrorMsg
                show={true}
                onClose={vi.fn()}
                subject="Error"
                message="Message"
            />
        );
        const closeButtons = screen.getAllByRole('button', { name: /close/i });
        expect(closeButtons.length).toBe(2);
    });

    it('calls onClose when footer Close button is clicked', async () => {
        vi.useRealTimers();
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <ServerErrorMsg
                show={true}
                onClose={onClose}
                subject="Error"
                message="Message"
            />
        );
        const closeButtons = screen.getAllByRole('button', { name: /close/i });
        await user.click(closeButtons[closeButtons.length - 1]);
        expect(onClose).toHaveBeenCalled();
    });

    it('renders the timer progress bar', () => {
        render(
            <ServerErrorMsg
                show={true}
                onClose={vi.fn()}
                subject="Error"
                message="Message"
            />
        );
        // Modal renders as a portal to document.body
        const progressBar = document.body.querySelector('.error-timer-bar');
        const progressIndicator = document.body.querySelector('.error-timer-progress');
        expect(progressBar).toBeInTheDocument();
        expect(progressIndicator).toBeInTheDocument();
    });

    it('timer counts down from 5', () => {
        render(
            <ServerErrorMsg
                show={true}
                onClose={vi.fn()}
                subject="Error"
                message="Message"
            />
        );
        const progress = document.body.querySelector('.error-timer-progress');
        expect(progress.style.width).toBe('100%');

        act(() => { vi.advanceTimersByTime(1000); });
        expect(progress.style.width).toBe('80%');

        act(() => { vi.advanceTimersByTime(1000); });
        expect(progress.style.width).toBe('60%');
    });
});
