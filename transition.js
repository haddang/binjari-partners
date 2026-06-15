document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('pageTransitionOverlay');
    if (!overlay) return;

    const transitionType = sessionStorage.getItem('nextTransitionType');
    sessionStorage.removeItem('nextTransitionType'); // Clear state immediately

    if (transitionType === 'to-login') {
        // We arrived at login page from a marketing page.
        // Overlay starts visible. Slide it out to the left (translateX: 0 -> -100%)
        overlay.classList.add('horizontal');
        overlay.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            overlay.style.pointerEvents = 'none';
            overlay.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
            overlay.style.transform = 'translateX(-100%)';
            overlay.classList.remove('show-title');
        }, 150);
    } else if (transitionType === 'from-login') {
        // We returned to home/marketing page from login.
        // Overlay starts visible. Slide it out to the right (translateX: 0 -> 100%)
        overlay.classList.add('horizontal');
        overlay.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            overlay.style.pointerEvents = 'none';
            overlay.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
            overlay.style.transform = 'translateX(100%)';
            overlay.classList.remove('show-title');
        }, 150);
    } else {
        // Standard vertical transition on load (translateY: 0 -> -100%)
        setTimeout(() => {
            overlay.classList.add('fade-out');
            overlay.classList.remove('show-title');
        }, 150);
    }

    // Set display none after transition finishes to optimize page performance (150ms delay + 750ms transition + safety buffer)
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1200);

    // Click Interceptor
    const linkSelectors = 'nav:not(.sidebar) a, .logo-link, .back-link';
    
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        if (!link.matches(linkSelectors)) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (link.target === '_blank') return;
        if (link.hostname !== window.location.hostname) return;
        
        // Ensure it resolves to a local webpage navigation
        if (!href.endsWith('.html') && href !== '/' && href !== './') return;

        // Prevent immediate navigation
        e.preventDefault();
        const targetUrl = link.href;

        // Reset cursor hover state so it doesn't get stuck during animation
        document.body.classList.remove('cursor-hover');

        // Determine page title to display
        const pageNames = {
            'index.html': 'HOME',
            'about.html': 'ABOUT',
            'features.html': 'FEATURES',
            'testimonials.html': 'TESTIMONIALS',
            'support.html': 'SUPPORT',
            'login.html': 'LOGIN',
            'dashboard.html': 'DASHBOARD'
        };
        const targetFilename = href.split('/').pop().split('#')[0] || 'index.html';
        const targetPageTitle = pageNames[targetFilename] || 'HOME';

        // Prepare overlay for display
        overlay.style.display = 'flex';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.remove('fade-out', 'show-title');
        
        const titleEl = overlay.querySelector('.transition-title');
        if (titleEl) {
            titleEl.textContent = targetPageTitle;
        }

        // Determine transition geometry
        if (targetFilename === 'login.html') {
            // Going to login: slide in horizontally from the right (translateX: 100% -> 0)
            sessionStorage.setItem('nextTransitionType', 'to-login');
            overlay.classList.add('horizontal');
            
            overlay.style.transition = 'none';
            overlay.style.transform = 'translateX(100%)';
            
            overlay.offsetHeight; // Reflow
            
            overlay.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
            overlay.style.transform = 'translateX(0)';
        } else if (window.location.pathname.includes('login.html')) {
            // Leaving login: slide in horizontally from the left (translateX: -100% -> 0)
            sessionStorage.setItem('nextTransitionType', 'from-login');
            overlay.classList.add('horizontal');
            
            overlay.style.transition = 'none';
            overlay.style.transform = 'translateX(-100%)';
            
            overlay.offsetHeight; // Reflow
            
            overlay.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
            overlay.style.transform = 'translateX(0)';
        } else {
            // Standard vertical slide in from bottom (translateY: 100% -> 0)
            overlay.classList.remove('horizontal');
            
            overlay.style.transition = 'none';
            overlay.style.transform = 'translateY(100%)';
            
            overlay.offsetHeight; // Reflow
            
            overlay.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
            overlay.style.transform = 'translateY(0)';
        }

        // Fade in target title
        setTimeout(() => {
            overlay.classList.add('show-title');
        }, 150);

        // Perform actual navigation after transition completes
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 750);
    });
});
