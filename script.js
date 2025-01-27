// Terminal Configuration
const CONFIG = {
    version: 'v0.01',
    username: 'anonymous',
    hostname: 'simplets',
    availableCommands: [
        'help', 'clear', 'video', 'stop', 
        'about', 'manifesto', 'project', 'minting', 
        'roadmap', 'team', 'links'
    ]
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
            const numCols = 12; // Ensure 12 columns for both boxes
            const cellWidth = 25;
            const cellHeight = 25;

            // Precompute gradient intensities
            const gradientIntensities = [];
            for (let x = 0; x < numCols; x++) {
                if (side === 'left') {
                    // Left box: white on left side, progressively darker towards center
                    // Use a softer power function to make the darkening less pronounced
                    gradientIntensities.push(Math.pow(1 - (x / (numCols - 1)), 1.5));
                } else {
                    // Right box: dark on left side, progressively whiter towards right
                    // Use a softer power function to make the darkening less pronounced
                    gradientIntensities.push(Math.pow(x / (numCols - 1), 1.5));
                }
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
                        if (Math.random() < 0.0125) {
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
            case 'clear':
                document.getElementById('terminal-output').innerHTML = '';
                return '';
            case 'stop':
                // Remove video and overlay
                const existingVideo = document.querySelector('.terminal-background-video');
                const existingOverlay = document.querySelector('.video-text-overlay');
                if (existingVideo) {
                    existingVideo.remove();
                    existingVideo.pause();
                }
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                return 'Video stopped. Returning to normal CLI view.';
            case 'video':
                // Remove any existing background video
                const currentVideo = document.querySelector('.terminal-background-video');
                const currentOverlay = document.querySelector('.video-text-overlay');
                if (currentVideo) {
                    currentVideo.remove();
                    currentVideo.pause();
                }
                if (currentOverlay) {
                    currentOverlay.remove();
                }

                // Create video element
                const video = document.createElement('video');
                video.src = 'video/SIMPLETS_PROMO.m4v';
                video.classList.add('terminal-background-video');
                video.autoplay = true;
                video.loop = false; // Disable looping
                video.muted = false;
                video.controls = true;

                // Optional text parameter
                const textParam = command.split(' ').slice(1).join(' ');
                let textOverlay = null;
                if (textParam) {
                    textOverlay = document.createElement('div');
                    textOverlay.classList.add('video-text-overlay');
                    textOverlay.textContent = textParam;
                }

                // Append to terminal
                document.getElementById('terminal').appendChild(video);
                if (textOverlay) {
                    document.getElementById('terminal').appendChild(textOverlay);
                }

                // Add event listener to handle video end
                video.addEventListener('ended', () => {
                    video.remove();
                    if (textOverlay) {
                        textOverlay.remove();
                    }
                });

                // Start video with error handling
                video.play().catch(error => {
                    console.error('Video playback failed:', error);
                    return 'Failed to play video. Check console for details.';
                });

                return textParam 
                    ? `Playing video with overlay: "${textParam}"` 
                    : 'Playing video in background...';
            case 'about':
                return `
<strong>SIMPLETS: Redefining Terminal Experience</strong>

SIMPLETS is an innovative terminal interface that blends cutting-edge technology 
with a minimalist, immersive design. Our mission is to transform how developers 
and tech enthusiasts interact with their digital environment.
                `;
            
            case 'manifesto':
                return `
<strong>SIMPLETS Manifesto</strong>

1. <span class="terminal-command">Simplicity</span>: Elegant, intuitive interfaces
2. <span class="terminal-command">Minimalism</span>: Removing unnecessary complexity
3. <span class="terminal-command">Innovation</span>: Pushing boundaries of terminal design
4. <span class="terminal-command">Accessibility</span>: Making tech more approachable
5. <span class="terminal-command">Creativity</span>: Transforming functional into beautiful

We believe that technology should inspire, not intimidate.
                `;
            
            case 'project':
                return `
<strong>SIMPLETS Project Description</strong>

SIMPLETS is a multichain web3 brand

a pseudonym supportive community
aim to boost pseudonym contributors in web3 space

A web3 brand empowering pseudonymous contributors, building a supportive 
community at the intersection of identity and innovation.
                `;
            
            case 'minting':
                return `
<strong>SIMPLETS Minting</strong>

- <span class="terminal-command">Total Supply</span>: 10,000 unique terminal interfaces
- <span class="terminal-command">Mint Price</span>: 0.069 ETH
- <span class="terminal-command">Blockchain</span>: Ethereum
- <span class="terminal-command">Smart Contract</span>: In development
- <span class="terminal-command">Whitelist</span>: Coming soon

Minting will grant exclusive access to advanced terminal features.
                `;
            
            case 'roadmap':
                return `
<strong>SIMPLETS Roadmap</strong>

\`\`\`
SIMPLETS Roadmap Tree:
├── NFTs
│   └── Initial Collection Launch
├── Community
│   ├── Guild.xyz Integration
│   └── DAO Setup
├── Infrastructure
│   ├── Marketplace Development
│   └── Custom Swarm Network (Eliza OS)
├── Content
│   ├── Podcasts
│   ├── Workshops
│   └── Media Hacks
├── Ecosystem
│   └── Strategic Partnerships
└── Tokenomics
    ├── Potential Airdrops
    └── Future Token Launch
\`\`\`

Potential airdrops and future token launch on the way
                `;
            
            case 'team':
                return `
<strong>SIMPLETS Team</strong>

- <span class="terminal-command">Founder</span>: Anonymous Developer (0xABCD...)
- <span class="terminal-command">Lead Designer</span>: UI/UX Minimalist
- <span class="terminal-command">Lead Developer</span>: Full-Stack Innovator
- <span class="terminal-command">Community Manager</span>: Tech Enthusiast

We are a collective of developers passionate about reimagining digital interfaces.
                `;
            
            case 'links':
                return `
<strong>SIMPLETS Links</strong>

- <span class="terminal-command">Website</span>: https://simplets.tech
- <span class="terminal-command">GitHub</span>: https://github.com/simplets-git
- <span class="terminal-command">Twitter</span>: @SIMPLETS_tech
- <span class="terminal-command">Discord</span>: discord.gg/simplets
- <span class="terminal-command">Email</span>: contact@simplets.tech
                `;
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
            <span class="user-info">[${CONFIG.username}]</span>:
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
                    responseLine.innerHTML = response.replace(/\n/g, '<br>');
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