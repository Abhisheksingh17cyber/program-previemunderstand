/**
 * Main Application Logic
 */
const App = {
    init() {
        // Initialize Modules
        if (window.Auth) Auth.init();
        if (window.Preview) Preview.init();
        if (window.Editor) Editor.init();

        // Global UI Handlers
        this.setupSettingsModal();
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '<i class="fa-solid fa-check-circle"></i>' :
            type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' :
                '<i class="fa-solid fa-info-circle"></i>';

        toast.innerHTML = `${icon} <span>${message}</span>`;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    setupSettingsModal() {
        const modal = document.getElementById('settings-modal');
        const btn = document.getElementById('settings-btn');
        const close = document.getElementById('close-settings');
        const save = document.getElementById('save-settings-btn');

        btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            // Load saved settings
            document.getElementById('api-key-input').value = localStorage.getItem('judge0_api_key') || '';
            document.getElementById('theme-select').value = localStorage.getItem('editor_theme') || 'dracula';
        });

        close.addEventListener('click', () => modal.classList.add('hidden'));

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        save.addEventListener('click', () => {
            const apiKey = document.getElementById('api-key-input').value.trim();
            const theme = document.getElementById('theme-select').value;

            localStorage.setItem('judge0_api_key', apiKey);
            localStorage.setItem('editor_theme', theme);

            if (window.Editor) Editor.setTheme(theme);

            modal.classList.add('hidden');
            this.showToast('Settings saved!', 'success');
        });
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
