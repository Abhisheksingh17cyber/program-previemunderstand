/**
 * Preview Module
 * Handles Web Preview and Code Execution
 */
const Preview = {
    init() {
        this.iframe = document.getElementById('web-preview-frame');
        this.console = document.getElementById('console-output');
        this.clearBtn = document.getElementById('clear-console-btn');
        this.refreshBtn = document.getElementById('refresh-preview-btn');

        this.clearBtn.addEventListener('click', () => {
            this.console.innerHTML = '';
        });

        this.refreshBtn.addEventListener('click', () => {
            const code = Editor.getValue();
            const lang = Editor.currentLang;
            this.run(code, lang, true);
        });
    },

    update(code, lang) {
        // Auto-update only for web langs
        if (['htmlmixed', 'css', 'javascript'].includes(lang)) {
            this.runWeb(code, lang);
        }
    },

    run(code, lang, manual = false) {
        if (['htmlmixed', 'css', 'javascript'].includes(lang)) {
            this.runWeb(code, lang);
            if (manual) App.showToast('Preview Refreshed', 'success');
        } else {
            this.runSystem(code, lang);
        }
    },

    runWeb(code, lang) {
        this.toggleView('web');
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;

        let content = code;

        if (lang === 'css') {
            content = `<html><head><style>${code}</style></head><body><h1>CSS Preview</h1><div class="test-box">Box</div></body></html>`;
        } else if (lang === 'javascript') {
            // Safe execution wrapper for JS
            content = `<html>
                <body>
                    <div id="output"></div>
                    <script>
                        const output = document.getElementById('output');
                        const log = console.log;
                        console.log = (...args) => {
                            output.innerHTML += args.join(' ') + '<br/>';
                            log(...args);
                        };
                        try {
                            ${code}
                        } catch(e) {
                            output.innerHTML += '<span style="color:red">' + e + '</span>';
                        }
                    <\/script>
                </body></html>`;
        }

        doc.open();
        doc.write(content);
        doc.close();
    },

    async runSystem(code, lang) {
        this.toggleView('console');
        this.logSystem('Running code...', 'system');

        const apiKey = localStorage.getItem('judge0_api_key');

        if (!apiKey) {
            // Mock Simulation
            setTimeout(() => {
                this.logSystem('Note: Running in Simulation Mode (No API Key provided).', 'system');
                this.logSystem('To run real code, add a Judge0 API Key in Settings.', 'system');
                this.logSystem('------------------------------------------------', 'system');

                if (lang === 'python') {
                    // Simple mock for python
                    if (code.includes('print')) {
                        const match = code.match(/print\((.*?)\)/);
                        if (match) this.logSystem(match[1].replace(/["']/g, ''));
                        else this.logSystem('Python Output Simulated');
                    }
                } else {
                    this.logSystem(`[${lang}] Code Executed Successfully (Simulated)`);
                    this.logSystem('Output: Hello World');
                }
            }, 500);
            return;
        }

        // Real API Call to Judge0
        const langIds = {
            'python': 71, // Python 3
            'java': 62,   // Java (OpenJDK 13)
            'clike': 54   // C++ (GCC 9)
        };

        const id = langIds[lang];
        if (!id) return;

        try {
            this.logSystem('Sending to compiler...', 'system');

            const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: id,
                    stdin: ""
                })
            });

            const result = await response.json();

            if (result.stdout) {
                this.logSystem(result.stdout);
            }
            if (result.stderr) {
                this.logSystem(result.stderr, 'error');
            }
            if (result.compile_output) {
                this.logSystem(result.compile_output, 'error');
            }

            this.logSystem(`\nProgram finished with exit code ${result.exit_code || 0}`, 'system');

        } catch (error) {
            this.logSystem('API Error: ' + error.message, 'error');
        }
    },

    toggleView(type) {
        if (type === 'web') {
            this.iframe.style.display = 'block';
            this.console.classList.add('hidden');
            this.clearBtn.style.display = 'none';
        } else {
            this.iframe.style.display = 'none';
            this.console.classList.remove('hidden');
            this.clearBtn.style.display = 'inline-block';
            this.console.innerHTML = ''; // Start fresh on new run
        }
    },

    logSystem(msg, type = 'normal') {
        const div = document.createElement('div');
        div.className = `console-line ${type}`;
        div.textContent = msg;
        this.console.appendChild(div);
        this.console.scrollTop = this.console.scrollHeight;
    }
};
