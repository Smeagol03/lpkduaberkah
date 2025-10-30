// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleMenu');
    const closeButton = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuContent = mobileMenu.querySelector('div');

    // Function to open the menu
    function openMenu() {
        mobileMenu.classList.remove('hidden');
        // Use setTimeout to ensure the transition works properly
        setTimeout(() => {
            mobileMenuContent.classList.remove('-translate-x-full');
        }, 10);
    }

    // Function to close the menu
    function closeMenu() {
        mobileMenuContent.classList.add('-translate-x-full');
        // Wait for the transition to complete before hiding the overlay
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300); // Match this with the CSS transition duration
    }

    // Event listeners
    if (toggleButton) {
        toggleButton.addEventListener('click', openMenu);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(event) {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    });
});