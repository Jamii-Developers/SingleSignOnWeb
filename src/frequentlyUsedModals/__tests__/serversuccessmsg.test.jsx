import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServerSuccessMsg from '../serversuccessmsg';

// Mock the sass import
vi.mock('../sass/serversuccessmsg.sass', () => ({}));

describe('ServerSuccessMsg component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders modal with subject and message when show is true', () => {
        render(
            <ServerSuccessMsg
                show={true}
                onClose={vi.fn()}
                subject="Success!"
                message="Operation completed"
            />
        );
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('does not render modal content when show is false', () => {
        render(
            <ServerSuccessMsg
                show={false}
                onClose={vi.fn()}
                subject="Success!"
                message="Operation completed"
            />
        );
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });

    it('renders Close buttons (header X and footer button)', () => {
        render(
            <ServerSuccessMsg
                show={true}
                onClose={vi.fn()}
                subject="Done"
                message="All good"
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
            <ServerSuccessMsg
                show={true}
                onClose={onClose}
                subject="Done"
                message="All good"
            />
        );
        const closeButtons = screen.getAllByRole('button', { name: /close/i });
        await user.click(closeButtons[closeButtons.length - 1]);
        expect(onClose).toHaveBeenCalled();
    });

    it('renders the timer progress bar', () => {
        render(
            <ServerSuccessMsg
                show={true}
                onClose={vi.fn()}
                subject="Done"
                message="All good"
            />
        );
        // Modal renders as a portal to document.body
        const progressBar = document.body.querySelector('.success-timer-bar');
        const progressIndicator = document.body.querySelector('.success-timer-progress');
        expect(progressBar).toBeInTheDocument();
        expect(progressIndicator).toBeInTheDocument();
    });

    it('timer counts down from 5', () => {
        render(
            <ServerSuccessMsg
                show={true}
                onClose={vi.fn()}
                subject="Done"
                message="All good"
            />
        );
        const progress = document.body.querySelector('.success-timer-progress');
        expect(progress.style.width).toBe('100%');

        act(() => { vi.advanceTimersByTime(1000); });
        expect(progress.style.width).toBe('80%');

        act(() => { vi.advanceTimersByTime(1000); });
        expect(progress.style.width).toBe('60%');
    });

    it('calls onClose automatically when timer reaches 0', () => {
        const onClose = vi.fn();
        render(
            <ServerSuccessMsg
                show={true}
                onClose={onClose}
                subject="Done"
                message="All good"
            />
        );

        act(() => { vi.advanceTimersByTime(5000); });
        expect(onClose).toHaveBeenCalled();
    });
});
