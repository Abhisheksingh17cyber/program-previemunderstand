/**
 * Auth Module
 * Handles Login, Register, Logout and Session Management
 */
const Auth = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkSession();
    },

    cacheDOM() {
        this.authView = document.getElementById('auth-view');
        this.editorView = document.getElementById('editor-view');
        this.authForm = document.getElementById('auth-form');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.switchBtn = document.getElementById('auth-switch-btn');
        this.switchText = document.getElementById('auth-switch-text');
        this.submitBtn = document.getElementById('auth-submit-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Editor User Display
        this.avatar = document.getElementById('user-avatar');
        this.displayUsername = document.getElementById('display-username');
        
        this.isLoginMode = true;
    },

    bindEvents() {
        this.switchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMode();
        });

        this.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.logoutBtn.addEventListener('click', () => {
            this.logout();
        });
    },

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        
        if (this.isLoginMode) {
            this.submitBtn.querySelector('span').textContent = 'Login';
            this.switchText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-switch-btn">Create one</a>';
            document.querySelector('.auth-header h2').textContent = 'Welcome Back';
            document.querySelector('.auth-header p').textContent = 'Sign in to continue your coding journey';
        } else {
            this.submitBtn.querySelector('span').textContent = 'Register';
            this.switchText.innerHTML = 'Already have an account? <a href="#" id="auth-switch-btn">Login</a>';
            document.querySelector('.auth-header h2').textContent = 'Create Account';
            document.querySelector('.auth-header p').textContent = 'Join the community of developers';
        }

        // Re-bind the new link (since innerHTML replaced it)
        document.getElementById('auth-switch-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMode();
        });
        
        this.authForm.reset();
    },

    handleSubmit() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username || !password) {
            App.showToast('Please fill in all fields', 'error');
            return;
        }

        if (this.isLoginMode) {
            this.login(username, password);
        } else {
            this.register(username, password);
        }
    },

    login(username, password) {
        const users = JSON.parse(localStorage.getItem('devstudio_users') || '{}');
        
        if (users[username] && users[username] === password) {
            this.setSession(username);
            App.showToast(`Welcome back, ${username}!`, 'success');
        } else {
            App.showToast('Invalid username or password', 'error');
        }
    },

    register(username, password) {
        const users = JSON.parse(localStorage.getItem('devstudio_users') || '{}');
        
        if (users[username]) {
            App.showToast('Username already exists', 'error');
            return;
        }

        // Simulating simple registration
        users[username] = password;
        localStorage.setItem('devstudio_users', JSON.stringify(users));
        
        this.setSession(username);
        App.showToast('Account created successfully!', 'success');
    },

    setSession(username) {
        localStorage.setItem('devstudio_session', username);
        this.loadUserInterface(username);
    },

    logout() {
        localStorage.removeItem('devstudio_session');
        this.editorView.classList.add('hidden');
        this.authView.classList.remove('hidden');
        this.authForm.reset();
        App.showToast('Logged out successfully', 'success');
    },

    checkSession() {
        const sessionUser = localStorage.getItem('devstudio_session');
        if (sessionUser) {
            this.loadUserInterface(sessionUser);
        }
    },

    loadUserInterface(username) {
        this.authView.classList.add('hidden');
        this.editorView.classList.remove('hidden');
        
        this.displayUsername.textContent = username;
        this.avatar.textContent = username.charAt(0).toUpperCase();
        
        // Trigger Editor Init if needed
        if (window.Editor && window.Editor.init) {
            // Editor likely already inited, but we can refresh layout
            window.Editor.refresh();
        }
    }
};
