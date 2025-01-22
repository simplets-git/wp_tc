// Terminal Configuration
const CONFIG = {
    version: 'v0.01',
    username: 'anonymous',
    hostname: 'simplets',
    availableCommands: ['help', 'version', 'clear']
};

// Utility Functions
const Utils = {
    /**
     * Create a new DOM element with optional classes and content
     * @param {string} tag - Element tag name
     * @param {string[]} [classes] - CSS classes to add
     * @param {string} [text] - Text content
     * @returns {HTMLElement}
     */
    createElement(tag, classes = [], text = '') {
        const element = document.createElement(tag);
        if (classes.length) element.classList.add(...classes);
        if (text) element.textContent = text;
        return element;
    },

    /**
     * Scroll an element to its bottom
     * @param {HTMLElement} element 
     */
    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }
};

// Wave Animation Module with SVG
const WaveAnimation = {
    /**
     * Create side wave animation boxes using SVG
     * @param {HTMLElement} terminal - Terminal element
     */
    create(terminal) {
        // Optimized characters for wave animation
        const waveChars = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
            'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
            'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '!', '?', '=', '*', '#', '$'
        ];

        const createSVGWave = (side) => {
            // Create side box and SVG container
            const sideBox = Utils.createElement('div', ['terminal-side-box', side]);
            const svgContainer = Utils.createElement('div', ['terminal-side-animation']);
            sideBox.appendChild(svgContainer);

            // Create SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '300');
            svg.setAttribute('height', `${window.innerHeight}`);
            svg.setAttribute('viewBox', `0 0 300 ${window.innerHeight}`);
            svg.style.width = '300px';
            svg.style.height = '100%';
            svgContainer.appendChild(svg);

            // Reduced configuration
            const numRows = Math.max(40, Math.ceil(window.innerHeight / 25));
            const numCols = 12;
            const cellWidth = 25;
            const cellHeight = 25;

            // Precompute gradient intensities
            const gradientIntensities = [];
            for (let x = 0; x < numCols; x++) {
                gradientIntensities.push(side === 'left' 
                    ? 1 - (x / (numCols - 1)) 
                    : x / (numCols - 1)
                );
            }

            // Create text elements with performance optimization
            const textElements = [];
            for (let y = 0; y < numRows; y++) {
                for (let x = 0; x < numCols; x++) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', `${x * cellWidth}`);
                    text.setAttribute('y', `${y * cellHeight}`);
                    text.setAttribute('font-family', 'Share Tech Mono');
                    text.setAttribute('font-size', '18');
                    text.setAttribute('fill', 'white');
                    svg.appendChild(text);
                    textElements.push(text);
                }
            }

            // Throttle animation updates
            let lastUpdateTime = 0;
            const UPDATE_INTERVAL = 100; // ms between updates

            // Optimized animation function with culling
            const animateWave = (currentTime) => {
                // Throttle updates
                if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
                    requestAnimationFrame(animateWave);
                    return;
                }
                lastUpdateTime = currentTime;

                // Viewport-based culling
                const visibleRows = Math.ceil(window.innerHeight / cellHeight) + 2;
                const startRow = Math.max(0, Math.floor(window.pageYOffset / cellHeight) - 1);
                const endRow = Math.min(numRows, startRow + visibleRows);

                // Batch update visible elements
                for (let y = startRow; y < endRow; y++) {
                    for (let x = 0; x < numCols; x++) {
                        const index = y * numCols + x;
                        const text = textElements[index];
                        
                        // Reduced randomization frequency
                        if (Math.random() < 0.0375) {
                            const char = Math.random() > 0.3 
                                ? waveChars[Math.floor(Math.random() * waveChars.length)]
                                : ' ';
                            text.textContent = char;
                        }

                        // Apply gradient
                        text.setAttribute('opacity', `${gradientIntensities[x]}`);
                    }
                }

                // Continue animation
                requestAnimationFrame(animateWave);
            };

            try {
                terminal.appendChild(sideBox);
                requestAnimationFrame(animateWave);
            } catch (error) {
                console.error('SVG Side Box Append Error:', error);
            }

            return sideBox;
        };

        // Create both left and right side boxes
        createSVGWave('left');
        createSVGWave('right');
    }
};

// Terminal Command Handler
const TerminalCommands = {
    /**
     * Process a terminal command
     * @param {string} command - Entered command
     * @returns {string} Response text
     */
    process(command) {
        const lowercaseCommand = command.toLowerCase().trim();
        
        switch(lowercaseCommand) {
            case 'help':
                return `Available commands: ${CONFIG.availableCommands.map(cmd => 
                    `<span class="terminal-command">${cmd}</span>`
                ).join(', ')}`;
            case 'version':
                return `SIMPLETS ${CONFIG.version}`;
            case 'clear':
                document.getElementById('terminal-output').innerHTML = '';
                return '';
            default:
                return `Command not found: ${command}`;
        }
    }
};

// Terminal Input Handler
const TerminalInput = {
    /**
     * Add a new prompt line to the terminal
     * @param {HTMLElement} terminalOutput - Terminal output container
     */
    addPrompt(terminalOutput) {
        // Remove any existing active command lines
        const existingActiveLines = document.querySelectorAll('.command-line[contenteditable="true"]');
        existingActiveLines.forEach(line => {
            line.contentEditable = 'false';
        });

        const promptLine = Utils.createElement('div', ['prompt-line']);
        promptLine.innerHTML = `
            <span class="user-info">${CONFIG.username}@${CONFIG.hostname}</span>:
            <span class="path">~</span>$ 
            <span class="command-line" contenteditable="true"></span>
        `;

        // Immediately make the line visible to prevent flickering
        promptLine.classList.add('visible');

        terminalOutput.appendChild(promptLine);
        
        const commandLine = promptLine.querySelector('.command-line');

        // Focus the new command line
        commandLine.focus();

        const handleCommand = () => {
            const command = commandLine.textContent.trim();
            
            // Disable editing
            commandLine.contentEditable = 'false';

            if (command) {
                const responseLine = Utils.createElement('div');
                const response = TerminalCommands.process(command);
                if (response) {
                    responseLine.innerHTML = response;
                    terminalOutput.appendChild(responseLine);
                }

                // Add new prompt after processing command
                this.addPrompt(terminalOutput);
            }

            // Ensure scroll is at the bottom
            Utils.scrollToBottom(terminalOutput);
        };

        commandLine.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand();
            }
        });

        // Ensure the terminal output is scrolled to the bottom
        Utils.scrollToBottom(terminalOutput);
    },

    /**
     * Initialize global key handling for terminal input
     */
    initGlobalKeyHandling() {
        document.addEventListener('keydown', (e) => {
            // Prevent input during loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen.style.display !== 'none') return;

            // Find the last command line
            const commandLines = document.querySelectorAll('.command-line');
            const lastCommandLine = commandLines[commandLines.length - 1];

            // Ensure the last command line is editable
            if (lastCommandLine && lastCommandLine.contentEditable !== 'true') {
                lastCommandLine.contentEditable = 'true';
            }

            // If no command line exists, create one
            if (!lastCommandLine) {
                this.addPrompt(document.getElementById('terminal-output'));
                return;
            }

            // Handle single character input
            if (e.key.length === 1 && !lastCommandLine.matches(':focus')) {
                e.preventDefault();
                lastCommandLine.focus();
                
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                    // Append character and move cursor
                    lastCommandLine.textContent += e.key;
                    
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(lastCommandLine);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        });
    }
};

// Main Terminal Initialization
document.addEventListener('DOMContentLoaded', () => {
    const asciiArt = `
 _______ _____ _______  _____         _______ _______ _______
 |______   |   |  |  | |_____] |      |______    |    |______
 ______| __|__ |  |  | |       |_____ |______    |    ______|
                                                            
    `;

    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const asciiArtElement = document.getElementById('ascii-art');
    const terminalOutput = document.getElementById('terminal-output');
    const terminal = document.getElementById('terminal');

    // Initial setup
    asciiArtElement.textContent = asciiArt;

    // Animate loading screen elements
    const animateLoadingScreen = () => {
        // Fade in logo
        setTimeout(() => {
            const logo = document.getElementById('logo');
            logo.style.opacity = '1';
        }, 300);

        // Fade in ASCII art
        setTimeout(() => {
            asciiArtElement.classList.add('visible');
        }, 500);

        // Fade in loading text
        setTimeout(() => {
            loadingText.classList.add('visible');
        }, 1000);
    };

    // Start loading animation
    const loadingTexts = [
        'Initializing SIMPLETS kernel...',
        'Loading system modules...',
        'Configuring network interfaces...',
        'Mounting filesystems...',
        'Authenticating system...',
        'Preparing terminal environment...'
    ];
    let textIndex = 0;

    const loadingInterval = setInterval(() => {
        loadingText.textContent = loadingTexts[textIndex];
        textIndex = (textIndex + 1) % loadingTexts.length;
    }, 1500);

    // Trigger initial animations
    animateLoadingScreen();

    // Transition to terminal
    const transitionToTerminal = () => {
        // Stop loading interval
        clearInterval(loadingInterval);

        // Fade out loading screen
        loadingScreen.classList.add('fade-out');

        // After fade out, fully hide loading screen and set up terminal
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Add welcome message as the first line
            const welcomeMessage = Utils.createElement('div');
            welcomeMessage.innerHTML = 'Welcome to the abyss. Type <span class="terminal-command">help</span> to interact.';
            terminalOutput.appendChild(welcomeMessage);
            
            // Create and add terminal logo
            const terminalLogo = Utils.createElement('div', [], '□_□');
            terminalLogo.id = 'terminal-logo';
            
            // Add click event to logo
            terminalLogo.addEventListener('click', () => {
                // Toggle theme
                document.body.classList.toggle('dark-theme');
                document.body.classList.toggle('light-theme');

                // Update about message with theme info
                const currentTheme = document.body.classList.contains('light-theme') ? 'Light' : 'Dark';
                const aboutMessage = `Current Theme: ${currentTheme}`;
                
                const responseLine = Utils.createElement('div');
                responseLine.innerHTML = aboutMessage;
                terminalOutput.appendChild(responseLine);
                
                // Add new prompt
                TerminalInput.addPrompt(terminalOutput);
                
                // Scroll to bottom
                Utils.scrollToBottom(terminalOutput);
            });
            
            // Append logo to terminal, not welcome message
            terminal.appendChild(terminalLogo);
            
            // Fade in terminal logo
            setTimeout(() => {
                terminalLogo.style.opacity = '1';
            }, 1500);
            
            // Start wave animation earlier
            WaveAnimation.create(terminal);
            
            // Set up terminal prompt
            TerminalInput.addPrompt(terminalOutput);
            TerminalInput.initGlobalKeyHandling();

            // Staggered animation for terminal output
            const terminalOutputElement = document.getElementById('terminal-output');
            terminalOutputElement.style.opacity = '0';
            terminalOutputElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                terminalOutputElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                terminalOutputElement.style.opacity = '1';
                terminalOutputElement.style.transform = 'translateY(0)';
            }, 500);
        }, 1000);
    };

    // Transition after 4 seconds
    setTimeout(transitionToTerminal, 4000);
}); 