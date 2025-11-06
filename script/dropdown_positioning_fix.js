// ============================================
// OPTIMIZED TAGS DROPDOWN - Enhanced JavaScript
// ============================================

/**
 * Tags Dropdown Manager
 * Handles dropdown visibility, positioning, and interactions
 */
class TagsDropdownManager {
    constructor() {
        this.dropdown = null;
        this.sortBtn = null;
        this.isOpen = false;
        this.closeHandler = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.dropdown = document.getElementById('sortDropdown');
        this.sortBtn = document.querySelector('.sort-btn');
        
        if (!this.dropdown || !this.sortBtn) {
            console.warn('Tags dropdown elements not found');
            return;
        }
        
        // Attach event listeners
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Button click handler
        this.sortBtn.addEventListener('click', (e) => this.toggleDropdown(e));
        
        // Keyboard accessibility
        this.sortBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown(e);
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
            }
        });
    }
    
    toggleDropdown(event) {
        event.stopPropagation();
        
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        if (!this.dropdown) return;
        
        // Add show class
        this.dropdown.classList.add('show');
        this.isOpen = true;
        
        // Smart positioning
        this.adjustDropdownPosition();
        
        // Ensure parent overflow is visible
        this.ensureParentVisibility();
        
        // Setup outside click handler (with small delay)
        setTimeout(() => {
            this.closeHandler = (e) => this.handleOutsideClick(e);
            document.addEventListener('click', this.closeHandler);
        }, 10);
    }
    
    closeDropdown() {
        if (!this.dropdown) return;
        
        this.dropdown.classList.remove('show');
        this.isOpen = false;
        
        // Remove outside click handler
        if (this.closeHandler) {
            document.removeEventListener('click', this.closeHandler);
            this.closeHandler = null;
        }
    }
    
    handleOutsideClick(event) {
        // Close if click is outside dropdown container
        if (!event.target.closest('.dropdown-sort')) {
            this.closeDropdown();
        }
    }
    
    adjustDropdownPosition() {
        if (!this.dropdown || !this.sortBtn) return;
        
        // Get viewport and element dimensions
        const btnRect = this.sortBtn.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // Reset positioning
        this.dropdown.style.top = '';
        this.dropdown.style.bottom = '';
        this.dropdown.style.left = '';
        this.dropdown.style.right = '';
        
        // Get dropdown height (may not be accurate until shown)
        const dropdownHeight = Math.min(this.dropdown.scrollHeight, 400);
        
        // Vertical positioning - check if enough space below
        const spaceBelow = windowHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Show above button
            this.dropdown.style.bottom = '100%';
            this.dropdown.style.marginBottom = '5px';
        } else {
            // Show below button (default)
            this.dropdown.style.top = '100%';
            this.dropdown.style.marginTop = '5px';
        }
        
        // Horizontal positioning - keep right-aligned by default
        this.dropdown.style.right = '0';
        
        // Check if dropdown goes beyond left edge
        const dropdownWidth = 200; // min-width from CSS
        if (btnRect.right < dropdownWidth) {
            this.dropdown.style.left = '0';
            this.dropdown.style.right = 'auto';
        }
    }
    
    ensureParentVisibility() {
        // Ensure all parent elements allow overflow visible
        let parent = this.dropdown.parentElement;
        const parentsModified = [];
        
        while (parent && parent !== document.body) {
            const originalOverflow = parent.style.overflow;
            if (originalOverflow !== 'visible') {
                parentsModified.push({ element: parent, original: originalOverflow });
                parent.style.overflow = 'visible';
            }
            parent = parent.parentElement;
        }
        
        // Store for potential restoration (not needed in this case)
        this.modifiedParents = parentsModified;
    }
}

// ============================================
// ENHANCED TOGGLE FUNCTION (Backward Compatible)
// ============================================

/**
 * Enhanced toggleSortDropdown function
 * Replaces the existing function with improved functionality
 * Maintains backward compatibility with existing onclick handlers
 */
function toggleSortDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    
    const dropdown = document.getElementById('sortDropdown');
    const sortBtn = document.querySelector('.sort-btn');
    
    if (!dropdown) return;
    
    const isCurrentlyShowing = dropdown.classList.contains('show');
    
    if (isCurrentlyShowing) {
        // Close dropdown
        dropdown.classList.remove('show');
        return;
    }
    
    // Open dropdown
    dropdown.classList.add('show');
    
    // Smart positioning
    if (sortBtn) {
        const btnRect = sortBtn.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = Math.min(400, dropdown.scrollHeight);
        
        // Reset positioning
        dropdown.style.top = '';
        dropdown.style.bottom = '';
        
        // Check vertical space
        const spaceBelow = windowHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Position above
            dropdown.style.bottom = '100%';
            dropdown.style.top = 'auto';
            dropdown.style.marginBottom = '5px';
            dropdown.style.marginTop = '0';
        } else {
            // Position below (default)
            dropdown.style.top = '100%';
            dropdown.style.bottom = 'auto';
            dropdown.style.marginTop = '5px';
            dropdown.style.marginBottom = '0';
        }
    }
    
    // Ensure high z-index
    dropdown.style.zIndex = '10000';
    
    // Close on outside click
    setTimeout(() => {
        function closeDropdown(e) {
            if (!e.target.closest('.dropdown-sort')) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeDropdown);
            }
        }
        document.addEventListener('click', closeDropdown);
    }, 10);
}

// ============================================
// ENHANCED SORT FUNCTION
// ============================================

/**
 * Enhanced sortByTag function with smooth transitions
 */
function sortByTag(tagName) {
    const dropdown = document.getElementById('sortDropdown');
    
    // Close dropdown
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // Existing sorting logic
    if (typeof allProperties !== 'undefined') {
        if (tagName === 'all') {
            displayProperties(allProperties);
        } else {
            const filteredProperties = allProperties.filter(property => {
                const status = property.status || 'New Lead';
                return status === tagName;
            });
            displayProperties(filteredProperties);
        }
    }
}

// ============================================
// AUTO-INITIALIZE
// ============================================

// Initialize the dropdown manager when DOM is ready
let tagsDropdownManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        tagsDropdownManager = new TagsDropdownManager();
    });
} else {
    tagsDropdownManager = new TagsDropdownManager();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize - reposition dropdown if open
 */
const handleResize = debounce(() => {
    const dropdown = document.getElementById('sortDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        const sortBtn = document.querySelector('.sort-btn');
        if (sortBtn) {
            // Reposition dropdown
            toggleSortDropdown();
            setTimeout(() => toggleSortDropdown(), 10);
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// EXPORT FOR MODULE SYSTEMS (Optional)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TagsDropdownManager,
        toggleSortDropdown,
        sortByTag
    };
}