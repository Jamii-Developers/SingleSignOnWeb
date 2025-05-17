import React from 'react';

const LoadingOrErrorScreen = ({ serverError, serverReady, showSuccessMessage }) => {
    if (serverError) {
        return (
            <div style={styles.screenBackground}>
                <div style={styles.cardError}>
                    <div style={styles.errorEmoji}>🚨</div>
                    <div style={{ marginTop: '1rem' }}>{serverError}</div>
                    <div style={{ marginTop: '1rem' }}>Check status of the server by clicking <a href="https://stats.uptimerobot.com/lVPlTGKPh4" target="_blank" rel="noopener noreferrer">here</a></div>
                </div>
                <style>{animations}</style>
            </div>
        );
    }

    if (!serverReady) {
        return (
            <div style={styles.screenBackground}>
                <div style={styles.card}>
                    <div style={styles.logoContainer}>
                        <div
                            style={{
                                ...styles.logoText,
                                color: showSuccessMessage ? '#00c851' : '#ffffff',
                            }}
                        >
                            {showSuccessMessage
                                ? "✅ Connected Successfully!"
                                : <>🔄 Connecting to <span style={{ fontWeight: 'bold' }}>Jamiix</span>...</>
                            }
                        </div>

                        {!showSuccessMessage && (
                            <div style={styles.loaderBar}>
                                <div style={styles.loaderIndicator} />
                            </div>
                        )}
                    </div>
                </div>
                <style>{animations}</style>
            </div>
        );
    }

    return null;
};

const styles = {
    screenBackground: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(26,26,26,0.8)', // semi-transparent black
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeSlideIn 0.8s ease-in-out forwards',
    },
    card: {
        backgroundColor: '#1f1f1f',
        padding: '3rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px',
        animation: 'scaleIn 0.8s ease-out forwards',
    },
    cardError: {
        backgroundColor: '#fff',
        padding: '3rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px',
        color: '#721c24',
        animation: 'scaleIn 0.8s ease-out forwards',
    },
    logoContainer: {
        textAlign: 'center',
    },
    logoText: {
        fontSize: '1.8rem',
        marginBottom: '2rem',
        opacity: 0,
        animation: 'fadeInText 1.5s forwards',
        animationDelay: '0.5s',
        transition: 'color 0.5s ease',
    },
    loaderBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#333',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '1rem',
    },
    loaderIndicator: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, #007bff, #00c6ff)',
        backgroundSize: '200% 200%',
        animation: 'loadingPulse 2s infinite',
    },
    errorEmoji: {
        fontSize: '3rem',
        animation: 'bounce 1.5s infinite',
    }
};

const animations = `
    @keyframes fadeSlideIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes fadeInText {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    @keyframes loadingPulse {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;

export default LoadingOrErrorScreen;
