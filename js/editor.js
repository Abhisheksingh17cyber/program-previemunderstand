/**
 * Editor Module
 * Wraps CodeMirror and handles file content
 */
const Editor = {
    cm: null, // CodeMirror instance
    currentLang: 'htmlmixed',

    init() {
        this.cacheDOM();
        this.initCodeMirror();
        this.bindEvents();
        this.loadSavedState();
    },

    cacheDOM() {
        this.container = document.getElementById('editor-container');
        this.langSelect = document.getElementById('language-select');
        this.runBtn = document.getElementById('run-btn');
        this.resizeHandle = document.getElementById('drag-handle');
    },

    initCodeMirror() {
        this.cm = CodeMirror(this.container, {
            mode: 'htmlmixed',
            theme: localStorage.getItem('editor_theme') || 'dracula',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            lineWrapping: true,
            tabSize: 4,
            indentUnit: 4
        });
    },

    bindEvents() {
        // Language Change
        this.langSelect.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Code Change
        this.cm.on('change', () => {
            this.saveState();
            Preview.update(this.getValue(), this.currentLang);
        });

        // Run Button
        this.runBtn.addEventListener('click', () => {
            Preview.run(this.getValue(), this.currentLang);
        });

        // Resizing
        this.initResizer();
    },

    setLanguage(langUserFriendly) {
        // Map UI values to CodeMirror modes
        const modeMap = {
            'htmlmixed': { mode: 'htmlmixed', name: 'HTML5' },
            'css': { mode: 'css', name: 'CSS3' },
            'javascript': { mode: 'javascript', name: 'JavaScript' },
            'python': { mode: 'python', name: 'Python 3' },
            'java': { mode: 'text/x-java', name: 'Java' },
            'clike': { mode: 'text/x-c++src', name: 'C++' }
        };

        const config = modeMap[langUserFriendly] || modeMap['htmlmixed'];
        this.currentLang = langUserFriendly;

        this.cm.setOption('mode', config.mode);

        // Update Default Template if empty
        if (!this.cm.getValue().trim()) {
            this.cm.setValue(this.getTemplate(langUserFriendly));
        }

        // Toggle Run Button based on Web vs System Lang
        if (['htmlmixed', 'css', 'javascript'].includes(langUserFriendly)) {
            // Web langs update automatically, but button can force refresh
            this.runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
        } else {
            this.runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
        }
    },

    getValue() {
        return this.cm.getValue();
    },

    setTheme(theme) {
        this.cm.setOption('theme', theme);
    },

    refresh() {
        setTimeout(() => this.cm.refresh(), 100);
    },

    saveState() {
        localStorage.setItem('devstudio_code', this.cm.getValue());
        localStorage.setItem('devstudio_lang', this.currentLang);
    },

    loadSavedState() {
        const savedLang = localStorage.getItem('devstudio_lang') || 'htmlmixed';
        const savedCode = localStorage.getItem('devstudio_code');

        this.langSelect.value = savedLang;
        this.setLanguage(savedLang); // This sets mode

        if (savedCode) {
            this.cm.setValue(savedCode);
        } else {
            this.cm.setValue(this.getTemplate(savedLang));
        }
    },

    getTemplate(lang) {
        const templates = {
            'htmlmixed': `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; padding: 20px; color: #333; }
        h1 { color: #58a6ff; }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>Welcome to DevStudio.</p>
</body>
</html>`,
            'css': `body {
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
div {
    width: 100px; 
    height: 100px;
    background: red;
}`,
            'javascript': `// Write your JS here
console.log("Hello from DevStudio!");
document.body.innerHTML = "<h1>JS Generated</h1>";`,
            'python': `# Python Code
def greet(name):
    return f"Hello, {name}!"

print(greet("DevStudio User"))`,
            'java': `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
            'clike': `#include <iostream>
using namespace std;

int main() {
    cout << "Hello C++ User!" << endl;
    return 0;
}`
        };
        return templates[lang] || '';
    },

    initResizer() {
        // Simple resizing logic for split pane
        let isDragging = false;

        this.resizeHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.body.style.cursor = 'col-resize';
            this.resizeHandle.style.background = 'var(--primary)';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const containerWidth = document.querySelector('.split-container').offsetWidth;
            const newFlexBasis = ((e.clientX - 60) / containerWidth) * 100; // 60 is sidebar width

            // Constrain
            if (newFlexBasis > 10 && newFlexBasis < 90) {
                document.querySelector('.editor-pane').style.flex = `0 0 ${newFlexBasis}%`;
            }

            this.cm.refresh(); // Important regarding sizing
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';
                this.resizeHandle.style.background = '';
                this.cm.refresh();
            }
        });
    }
};
