// Add after your DOM ready event

// Function to make header stick to top
function setupStickyHeader() {
    const header = document.querySelector('.sticky-nutrition-header');
    const content = document.querySelector('.shake-builder-content');
    
    if (!header || !content) return;
    
    // Initial position
    header.style.position = 'absolute';
    header.style.top = '0';
    header.style.left = '0';
    
    // Update header position on scroll
    window.addEventListener('scroll', function() {
        // Get scroll position
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Make it fixed when scrolling down
        if (scrollY > 0) {
            header.style.position = 'fixed';
            header.style.top = '0';
        } else {
            // Return to normal position when at top
            header.style.position = 'absolute';
            header.style.top = '0';
        }
    });
    
    // Ensure it's visible after load
    setTimeout(function() {
        header.style.position = 'fixed';
        header.style.top = '0';
    }, 100);
}

// Call the function to set up the sticky header
setupStickyHeader();
