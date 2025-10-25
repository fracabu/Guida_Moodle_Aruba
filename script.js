// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initHighlight();
    initDarkMode();
    initSidebar();
    initProgressBar();
    initSearch();
    initChecklist();
    initScrollSpy();
    loadChecklistProgress();
    fixCopyButtons();
});

// ============================================
// CODE HIGHLIGHTING
// ============================================
function initHighlight() {
    hljs.highlightAll();
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedMode = localStorage.getItem('darkMode');

    // Load saved preference
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// ============================================
// SIDEBAR NAVIGATION
// ============================================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('sidebarOverlay');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle sidebar on mobile (both buttons)
    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    };

    toggleBtn.addEventListener('click', toggleSidebar);
    menuToggle.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Close sidebar when clicking a nav item on mobile
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) &&
                !toggleBtn.contains(e.target) &&
                !menuToggle.contains(e.target) &&
                !overlay.contains(e.target)) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        }
    });
}

// ============================================
// PROGRESS BAR
// ============================================
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

        progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Open search
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    // Close search
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Close when clicking overlay background
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Search as user types
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        performSearch(query);
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const sections = document.querySelectorAll('.content-section');
    const results = [];

    sections.forEach(section => {
        const sectionId = section.id;
        const sectionTitle = section.querySelector('h2')?.textContent || '';
        const sectionText = section.textContent.toLowerCase();

        if (sectionText.includes(query)) {
            // Find relevant excerpt
            const textContent = section.textContent;
            const queryIndex = textContent.toLowerCase().indexOf(query);
            const start = Math.max(0, queryIndex - 50);
            const end = Math.min(textContent.length, queryIndex + query.length + 50);
            let excerpt = textContent.substring(start, end);

            if (start > 0) excerpt = '...' + excerpt;
            if (end < textContent.length) excerpt = excerpt + '...';

            // Highlight query in excerpt
            const regex = new RegExp(`(${query})`, 'gi');
            excerpt = excerpt.replace(regex, '<mark>$1</mark>');

            results.push({
                id: sectionId,
                title: sectionTitle,
                excerpt: excerpt
            });
        }
    });

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-secondary);">Nessun risultato trovato</div>';
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="goToSection('${result.id}')">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-excerpt">${result.excerpt}</div>
        </div>
    `).join('');
}

function goToSection(sectionId) {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Close search
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';

    // Navigate to section
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// FIX COPY BUTTONS POSITION
// ============================================
function fixCopyButtons() {
    // Trova tutti i pulsanti copia
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(button => {
        // Trova il pre precedente
        const pre = button.previousElementSibling;

        if (pre && pre.tagName === 'PRE') {
            // Sposta il button dentro il pre
            pre.appendChild(button);
        }
    });
}

// ============================================
// COPY CODE FUNCTIONALITY
// ============================================
function copyCode(button) {
    // Il button ora è dentro il pre
    const pre = button.parentElement;
    const code = pre.querySelector('code');
    const text = code.textContent;

    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = '✓ Copiato!';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Errore nella copia:', err);
        button.textContent = '✗ Errore';

        setTimeout(() => {
            button.textContent = 'Copia';
        }, 2000);
    });
}

// ============================================
// CHECKLIST FUNCTIONALITY
// ============================================
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', (e) => {
            const item = e.target.closest('.checklist-item');

            if (e.target.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }

            saveChecklistProgress();
            updateChecklistProgress();
        });
    });
}

function saveChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const progress = [];

    checkboxes.forEach(checkbox => {
        progress.push(checkbox.checked);
    });

    localStorage.setItem('checklistProgress', JSON.stringify(progress));
}

function loadChecklistProgress() {
    const saved = localStorage.getItem('checklistProgress');

    if (!saved) return;

    const progress = JSON.parse(saved);
    const checkboxes = document.querySelectorAll('.checklist-checkbox');

    checkboxes.forEach((checkbox, index) => {
        if (progress[index]) {
            checkbox.checked = true;
            checkbox.closest('.checklist-item').classList.add('completed');
        }
    });

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const total = checkboxes.length;
    const completed = document.querySelectorAll('.checklist-checkbox:checked').length;
    const percentage = Math.round((completed / total) * 100);

    // Update progress in sidebar if needed
    const checklistNav = document.querySelector('[data-section="checklist"]');
    if (checklistNav) {
        const badge = checklistNav.querySelector('.progress-badge') || createProgressBadge();
        badge.textContent = `${percentage}%`;

        if (!checklistNav.querySelector('.progress-badge')) {
            checklistNav.appendChild(badge);
        }

        if (percentage === 100) {
            badge.style.background = 'var(--success-color)';
        } else {
            badge.style.background = 'var(--warning-color)';
        }
    }
}

function createProgressBadge() {
    const badge = document.createElement('span');
    badge.className = 'progress-badge';
    badge.style.cssText = `
        margin-left: auto;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        color: white;
        font-weight: 600;
    `;
    return badge;
}

// ============================================
// SCROLL SPY
// ============================================
function initScrollSpy() {
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');

            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Reset checklist
function resetChecklist() {
    if (confirm('Sei sicuro di voler resettare tutti i progressi della checklist?')) {
        localStorage.removeItem('checklistProgress');

        const checkboxes = document.querySelectorAll('.checklist-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.checklist-item').classList.remove('completed');
        });

        updateChecklistProgress();
    }
}

// Export progress
function exportProgress() {
    const progress = localStorage.getItem('checklistProgress');
    const darkMode = localStorage.getItem('darkMode');

    const data = {
        checklistProgress: progress ? JSON.parse(progress) : [],
        darkMode: darkMode || 'disabled',
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moodle-guida-progress.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import progress
function importProgress(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (data.checklistProgress) {
                localStorage.setItem('checklistProgress', JSON.stringify(data.checklistProgress));
                loadChecklistProgress();
            }

            if (data.darkMode) {
                localStorage.setItem('darkMode', data.darkMode);

                if (data.darkMode === 'enabled') {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }

            alert('Progressi importati con successo!');
        } catch (err) {
            alert('Errore nell\'importazione del file');
            console.error(err);
        }
    };

    reader.readAsText(file);
}

// Print guide
function printGuide() {
    window.print();
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add scroll to top button
window.addEventListener('scroll', () => {
    let scrollBtn = document.getElementById('scrollToTopBtn');

    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollToTopBtn';
        scrollBtn.innerHTML = '↑';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            display: none;
        `;
        scrollBtn.addEventListener('click', scrollToTop);
        document.body.appendChild(scrollBtn);
    }

    if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
        setTimeout(() => {
            scrollBtn.style.opacity = '1';
        }, 10);
    } else {
        scrollBtn.style.opacity = '0';
        setTimeout(() => {
            scrollBtn.style.display = 'none';
        }, 300);
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBtn').click();
    }

    // Ctrl/Cmd + D: Toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('darkModeToggle').click();
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🎓 Guida Moodle su Aruba', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cScorciatoie da tastiera:', 'font-size: 14px; font-weight: bold;');
console.log('Ctrl/Cmd + K: Apri ricerca');
console.log('Ctrl/Cmd + D: Toggle dark mode');
console.log('Funzioni disponibili:');
console.log('- resetChecklist(): Resetta tutti i progressi');
console.log('- exportProgress(): Esporta i progressi');
console.log('- scrollToTop(): Scroll in cima alla pagina');
