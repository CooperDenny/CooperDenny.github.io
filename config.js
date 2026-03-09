/**
 * Website Configuration
 * Easy customization of colors, animations, and features
 */

const CONFIG = {
    // Theme Configuration
    themes: {
        colors: {
            // Primary brand colors
            accent: '#0ea5e9',           // Data science blue
            accentSecondary: '#059669',   // Sports green  
            accentPurple: '#7c3aed',     // Innovation purple
            accentTertiary: '#dc2626',   // Energy red
            
            // Modify these for different color schemes
            brandPrimary: '#0ea5e9',
            brandSecondary: '#059669',
        },
        
        // Animation settings
        animations: {
            duration: 400,               // Base animation duration (ms)
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            stagger: 100,               // Stagger delay between elements
            
            // Disable animations on low-power devices
            respectsReducedMotion: true,
        }
    },

    // Feature toggles
    features: {
        particleSystem: true,        // Background particles
        floatingCharts: true,        // Hero section floating elements
        autoTheme: false,           // Auto light/dark based on time
        soundEffects: false,        // Audio feedback (future)
        analytics: false,           // Usage tracking (future)
    },

    // Performance settings
    performance: {
        lazyLoadImages: true,
        optimizeAnimations: true,
        prefetchLinks: true,
    },

    // Social links (easily updatable)
    social: {
        email: 'cooper.denny@icloud.com',
        linkedin: 'https://www.linkedin.com/in/cooperdenny/',
        github: 'https://github.com/CooperDenny', 
        twitter: 'https://x.com/coopercdenny',
    },

    // Content customization
    content: {
        heroStats: [
            { label: 'Python/R', value: 95 },
            { label: 'Machine Learning', value: 88 },
            { label: 'Data Visualization', value: 92 }
        ],
        
        floatingChartLabels: [
            'Sports Analytics',
            '94% Accuracy', 
            'Data Insights'
        ]
    }
};

// Export for use in main scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}