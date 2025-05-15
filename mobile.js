// Simple script for mobile view only
document.addEventListener('DOMContentLoaded', () => {
    // Set up the mobile-only view content
    const mobileAboutInfo = document.getElementById('mobile-about-info');
    if (mobileAboutInfo) {
        // Get the about text from translations
        const aboutText = getTranslation('commands.about');
        mobileAboutInfo.innerHTML = aboutText;
    }
    
    // Add theme toggle for mobile
    const mobileOnlyView = document.getElementById('mobile-only-view');
    if (mobileOnlyView) {
        // Add theme toggle button to mobile view
        const themeToggle = document.createElement('button');
        themeToggle.textContent = 'Toggle Theme';
        themeToggle.className = 'theme-toggle-btn';
        themeToggle.style.marginTop = '20px';
        themeToggle.style.padding = '10px 15px';
        themeToggle.style.backgroundColor = '#333';
        themeToggle.style.color = 'white';
        themeToggle.style.border = '1px solid #555';
        themeToggle.style.borderRadius = '4px';
        themeToggle.style.cursor = 'pointer';
        
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.add('light-theme');
            }
        });
        
        mobileOnlyView.appendChild(themeToggle);
    }
});
