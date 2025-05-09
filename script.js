// =====================
// Utility Functions
// =====================
const Utils = {
    createElement(tag, classes = [], text = '') {
        const element = document.createElement(tag);
        if (classes.length) element.classList.add(...classes);
        if (text) element.textContent = text;
        return element;
    },
    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    },
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease`;
        setTimeout(() => { element.style.opacity = '1'; }, 10);
    },
    fadeOut(element, duration = 500, callback) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, duration);
    },
    showThemeButton() {
        const themeButton = document.getElementById('terminal-logo');
        if (themeButton) {
            themeButton.style.display = 'block';
            setTimeout(() => { themeButton.style.opacity = '1'; }, 10);
        }
    },
    hideThemeButton() {
        const themeButton = document.getElementById('terminal-logo');
        if (themeButton) {
            themeButton.style.transition = 'opacity 0.5s ease';
            themeButton.style.opacity = '0';
            setTimeout(() => { themeButton.style.display = 'none'; }, 500);
        }
    },
    generateRandomCharacterPairSVG(backgroundColor = 'white', indices = null) {
        const chars = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
            'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
            'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', '#', '$', '%', '-', '*', '^', '~', '"'
        ];
        function randomIndex() {
            return Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70);
        }
        let index1, index2;
        if (indices && Array.isArray(indices) && indices.length === 2) {
            [index1, index2] = indices;
        } else {
            index1 = randomIndex();
            index2 = randomIndex();
            if (index1 === index2) index2 = (index2 + 1) % 70;
        }
        const left = chars[index1];
        const right = chars[index2];
        const pair = `${left}_${right}`;
        const textColor = backgroundColor === 'black' ? 'white' : 'black';
        return `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <circle cx="150" cy="150" r="140" fill="${backgroundColor}" />
  <style>
    text {
      font-family: Arial, sans-serif;
      font-size: 80px;
    }
  </style>
  <text x="125" y="170" text-anchor="end" fill="${textColor}">${left}</text>
  <text x="150" y="170" text-anchor="middle" fill="${textColor}">_</text>
  <text x="175" y="170" text-anchor="start" fill="${textColor}">${right}</text>
</svg>`;
    }
};

// --- THEME-DEPENDENT SVG UPDATER ---
function updateAllThemeSVGs() {
    const isLight = document.body.classList.contains('light-theme');
    const bgColor = isLight ? 'black' : 'white';
    document.querySelectorAll('img.theme-svg').forEach(img => {
        // Use indices if available, else parse pair
        let indices = null;
        if (img.dataset.indices) {
            indices = img.dataset.indices.split(',').map(Number);
        }
        // Generate new SVG with the correct theme
        const svg = Utils.generateRandomCharacterPairSVG(bgColor, indices);
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    });
}

// --- GLOBAL STORAGE FOR PROJECT SVG PAIRS ---
window._projectSVGPairIndices = null;

// =====================
// Wave Animation Module
// =====================
const WaveAnimation = {
    create(terminal) {
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
            const sideBox = Utils.createElement('div', ['terminal-side-box', side]);
            const svgContainer = Utils.createElement('div', ['terminal-side-animation']);
            sideBox.appendChild(svgContainer);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '300');
            svg.setAttribute('height', `${window.innerHeight}`);
            svg.setAttribute('viewBox', `0 0 300 ${window.innerHeight}`);
            svg.style.width = '300px';
            svg.style.height = '100%';
            svgContainer.appendChild(svg);

            const numRows = Math.max(40, Math.ceil(window.innerHeight / 25));
            const numCols = 12; 
            const cellWidth = 25;
            const cellHeight = 25;

            const gradientIntensities = [];
            for (let x = 0; x < numCols; x++) {
                if (side === 'left') {
                    gradientIntensities.push(Math.pow(1 - (x / (numCols - 1)), 1.5));
                } else {
                    gradientIntensities.push(Math.pow(x / (numCols - 1), 1.5));
                }
            }

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

            let lastUpdateTime = 0;
            const UPDATE_INTERVAL = 100; 

            const animateWave = (currentTime) => {
                if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
                    requestAnimationFrame(animateWave);
                    return;
                }
                lastUpdateTime = currentTime;

                const visibleRows = Math.ceil(window.innerHeight / cellHeight) + 2;
                const startRow = Math.max(0, Math.floor(window.pageYOffset / cellHeight) - 1);
                const endRow = Math.min(numRows, startRow + visibleRows);

                for (let y = startRow; y < endRow; y++) {
                    for (let x = 0; x < numCols; x++) {
                        const index = y * numCols + x;
                        const text = textElements[index];
                        
                        if (Math.random() < 0.0125) {
                            const char = Math.random() > 0.3 
                                ? waveChars[Math.floor(Math.random() * waveChars.length)]
                                : ' ';
                            text.textContent = char;
                        }

                        text.setAttribute('opacity', `${gradientIntensities[x]}`);
                    }
                }

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

        createSVGWave('left');
        createSVGWave('right');
    }
};

// =====================
// Terminal Command Handler
// =====================
const TerminalCommands = {
    process(command) {
        const lowercaseCommand = command.toLowerCase().trim();
        switch(lowercaseCommand) {
            case 'help':
                return `${getTranslation('availableCommands')}${CONFIG.availableCommands.map(cmd => 
                    `<span class="terminal-command">${cmd}</span>`
                ).join(', ')}`;
            case 'clear':
                // Keep the welcome message after clearing
                const terminalOutput = document.getElementById('terminal-output');
                terminalOutput.innerHTML = `<div class="welcome-line">${getTranslation('welcome')}</div>`;
                return '';
            case 'stop':
                this.stopVideo();
                return getTranslation('videoStopped');
            case 'video':
                return this.playVideo(command);
            case 'about':
                return getTranslation('commands.about');
            case 'manifesto':
                return getTranslation('commands.manifesto');
            case 'project': {
                const isLight = document.body.classList.contains('light-theme');
                const bgColor = isLight ? 'black' : 'white';
                // Always generate new pairs
                const indices1 = [Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70), Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70)];
                const indices2 = [Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70), Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70)];
                // Always use latest generateRandomCharacterPairSVG (with indices)
                const svg1 = Utils.generateRandomCharacterPairSVG(bgColor, indices1);
                const svg2 = Utils.generateRandomCharacterPairSVG(bgColor, indices2);
                function svgToDataURL(svg) {
                    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                }
                const img1 = `<img class="theme-svg" data-indices="${indices1.join(',')}" src="${svgToDataURL(svg1)}" width="300" height="300" alt="NFT Example 1" style="display:inline-block;vertical-align:middle;" />`;
                const img2 = `<img class="theme-svg" data-indices="${indices2.join(',')}" src="${svgToDataURL(svg2)}" width="300" height="300" alt="NFT Example 2" style="display:inline-block;vertical-align:middle;" />`;
                const projectTitle = '<strong>SIMPLETS Project</strong>';
                const projectDesc = `SIMPLETS is a multichain web3 brand<br>\
A pseudonym supportive community aiming to boost pseudonym contributors in web3 space.<br>\
A web3 brand empowering pseudonymous contributors, building a supportive community at the intersection of identity and innovation.`;
                const aboveText = '<em>Random Character Pair NFT Example</em>';
                const belowText = '<em>Every image is unique. Theme switch = new art!</em>';
                return `
<div class="project-svg-block">
  <div class="project-above-text">${aboveText}</div>
  <div class="project-svg" style="display:flex;justify-content:center;margin:16px 0;gap:16px;">
    <div>${img1}</div>
    <div>${img2}</div>
  </div>
  <div class="project-title">${projectTitle}</div>
  <div class="project-desc">${projectDesc}</div>
  <div class="project-below-text">${belowText}</div>
</div>
`;
            }
            case 'minting':
                return getTranslation('commands.minting');
            case 'roadmap':
                return getTranslation('commands.roadmap');
            case 'team':
                return getTranslation('commands.team');
            case 'links':
                return getTranslation('commands.links');
            case 'legal':
                return getTranslation('commands.legal');
            case 'language':
                return getTranslation('commands.language');
            default:
                // Check for hidden set lang command
                if (lowercaseCommand.startsWith('set lang ')) {
                    const langCode = lowercaseCommand.split(' ')[2];
                    const validLangCodes = ['en', 'hi', 'zh', 'es', 'pt', 'ru', 'id', 'vi', 'ja', 'tr', 'de', 'fr', 'ar', 'th', 'uk'];
                    
                    if (validLangCodes.includes(langCode)) {
                        window.currentLanguage = langCode;
                        return getTranslation('languageChanged') + langCode;
                    } else {
                        return getTranslation('invalidLanguage');
                    }
                }
                return getTranslation('commandNotFound') + command;
        }
    },
    stopVideo() {
        const videoToStop = document.querySelector('.terminal-background-video');
        const overlayToStop = document.querySelector('.video-text-overlay');
        if (videoToStop) {
            videoToStop.remove();
            videoToStop.pause();
        }
        if (overlayToStop) {
            overlayToStop.remove();
        }
        const themeButton = document.getElementById('terminal-logo');
        if (themeButton) {
            setTimeout(() => {
                Utils.fadeIn(themeButton, 500);
            }, 500);
        }
    },
    playVideo(command) {
        if (document.body.classList.contains('light-theme')) {
            return getTranslation('videoThemeWarning');
        }
        this.stopVideo();
        Utils.hideThemeButton();
        const video = document.createElement('video');
        video.src = 'video/SMP_vid.m4v';
        video.className = 'terminal-background-video';
        video.style.opacity = '0';
        video.style.transition = 'opacity 1s ease';
        video.autoplay = true;
        video.loop = false;
        video.muted = false;
        video.controls = true;
        const textParam = command.split(' ').slice(1).join(' ');
        let textOverlay = null;
        if (textParam) {
            textOverlay = document.createElement('div');
            textOverlay.classList.add('video-text-overlay');
            textOverlay.textContent = textParam;
        }
        const terminal = document.getElementById('terminal');
        terminal.appendChild(video);
        if (textOverlay) terminal.appendChild(textOverlay);
        setTimeout(() => { video.style.opacity = '1'; }, 10);
        video.addEventListener('ended', () => {
            video.remove();
            if (textOverlay) textOverlay.remove();
            const themeButton = document.getElementById('terminal-logo');
            if (themeButton) {
                setTimeout(() => {
                    Utils.fadeIn(themeButton, 500);
                }, 500);
            }
        });
        return textParam 
            ? `Playing video with overlay: "${textParam}"` 
            : 'Playing video in background...';
    }
};

// --- THEME SWITCH HANDLER ---
(function() {
    const themeButton = document.getElementById('terminal-logo');
    if (!themeButton) return;
    themeButton.addEventListener('click', () => {
        setTimeout(() => {
            updateAllThemeSVGs();
        }, 200);
    });
})();

// When user runs project again, clear indices so new pairs are generated
(function() {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;
    terminalOutput.addEventListener('DOMNodeInserted', function(e) {
        if (e.target && e.target.innerText && e.target.innerText.includes('SIMPLETS Project')) {
            // Clear indices so next run generates new
            window._projectSVGPairIndices = null;
        }
    });
})();

// =====================
// Terminal Input Handler
// =====================
const TerminalInput = {
    addPrompt(terminalOutput) {

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

        promptLine.classList.add('visible');

        terminalOutput.appendChild(promptLine);
        
        const commandLine = promptLine.querySelector('.command-line');

        const handleCommand = () => {
            const command = commandLine.textContent.trim();
            
            commandLine.contentEditable = 'false';

            if (command) {
                const responseLine = Utils.createElement('div');
                const response = TerminalCommands.process(command);
                if (response) {
                    responseLine.innerHTML = response.replace(/\n/g, '<br>');
                    terminalOutput.appendChild(responseLine);
                }

                this.addPrompt(terminalOutput);
            }

            Utils.scrollToBottom(terminalOutput);
        };

        commandLine.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand();
            }
        });

        Utils.scrollToBottom(terminalOutput);
    },
    initGlobalKeyHandling() {
        document.addEventListener('keydown', (e) => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen.style.display !== 'none') return;

            const commandLines = document.querySelectorAll('.command-line');
            const lastCommandLine = commandLines[commandLines.length - 1];

            if (lastCommandLine && lastCommandLine.contentEditable !== 'true') {
                lastCommandLine.contentEditable = 'true';
            }

            if (!lastCommandLine) {
                this.addPrompt(document.getElementById('terminal-output'));
                return;
            }

            if (e.key.length === 1 && !lastCommandLine.matches(':focus')) {
                e.preventDefault();
                lastCommandLine.focus();
                
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
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

// =====================
// Terminal Configuration
// =====================
// Global language setting
window.currentLanguage = 'en';

const CONFIG = {
    version: 'v0.4',
    username: 'anonymous',
    hostname: 'simplets',
    availableCommands: [
        'help', 'clear', 'video', 'stop', 
        'about', 'manifesto', 'project', 'minting', 
        'roadmap', 'team', 'links', 'legal', 'language'
    ]
};

// =====================
// Main Initialization
// =====================
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

    asciiArtElement.textContent = asciiArt;

    const animateLoadingScreen = () => {
        setTimeout(() => {
            const logo = document.getElementById('logo');
            logo.style.opacity = '1';
        }, 300);

        setTimeout(() => {
            asciiArtElement.classList.add('visible');
        }, 500);

        setTimeout(() => {
            loadingText.classList.add('visible');
        }, 1000);
    };

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

    animateLoadingScreen();

    const transitionToTerminal = () => {
        clearInterval(loadingInterval);

        loadingScreen.classList.add('fade-out');

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            const welcomeMessage = Utils.createElement('div');
            welcomeMessage.innerHTML = getTranslation('welcome');
            terminalOutput.appendChild(welcomeMessage);
            
            const terminalLogo = Utils.createElement('div', [], '□_□');
            terminalLogo.id = 'terminal-logo';
            
            terminalLogo.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                document.body.classList.toggle('light-theme');

                updateAllThemeSVGs();

                const currentTheme = document.body.classList.contains('light-theme') ? 'Light' : 'Dark';
                const aboutMessage = `${getTranslation('currentTheme')}${currentTheme}`;
                
                const responseLine = Utils.createElement('div');
                responseLine.innerHTML = aboutMessage;
                terminalOutput.appendChild(responseLine);
                
                TerminalInput.addPrompt(terminalOutput);
                
                Utils.scrollToBottom(terminalOutput);
            });
            
            terminal.appendChild(terminalLogo);
            
            setTimeout(() => {
                terminalLogo.style.opacity = '1';
            }, 1500);
            
            WaveAnimation.create(terminal);
            
            TerminalInput.addPrompt(terminalOutput);
            TerminalInput.initGlobalKeyHandling();

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

    setTimeout(transitionToTerminal, 4000);

    const versionDiv = document.getElementById('version-display');
    if (versionDiv) versionDiv.textContent = `Version: ${CONFIG.version}`;
});