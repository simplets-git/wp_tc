console.log('SCRIPT.JS LOADED');
// =====================
// Utility Functions
// =====================
const Utils = {
    focusAndSetCursorAtEnd(element) {
        if (!element) return;
        // Remove all child nodes except text (should only be text)
        if (element.childNodes.length > 1 || (element.childNodes.length === 1 && element.childNodes[0].nodeType !== Node.TEXT_NODE)) {
            element.textContent = element.textContent;
        }
        element.focus();
        // Use the bulletproof method for caret at end
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false); // Collapse to end
            selection.removeAllRanges();
            selection.addRange(range);
        }
    },
    // Utility to update the visual cursor position to the end of the text
    updateVisualCursor(commandLine) {
        const cursor = commandLine?.parentNode?.querySelector('.cursor-indicator');
        if (!cursor || !commandLine) return;
        // Create a hidden span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.position = 'absolute';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = window.getComputedStyle(commandLine).font;
        tempSpan.textContent = commandLine.textContent;
        document.body.appendChild(tempSpan);
        // Position cursor at end of text
        cursor.style.left = `${tempSpan.offsetWidth}px`;
        document.body.removeChild(tempSpan);
    },
    createElement(tag, classes = [], text = '') {
        const element = document.createElement(tag);
        if (classes.length) element.classList.add(...classes);
        if (text) element.textContent = text;
        return element;
    },
    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    },

    focusAndSetCursorAtStart(element) {
        if (!element) {
            console.error(' ERROR: focusAndSetCursorAtStart called with null element');
            return;
        }
        console.log(' DIAGNOSTIC: Utils.focusAndSetCursorAtStart for element:', element);
        element.focus();
        console.log(' DIAGNOSTIC: Element focused. Active element:', document.activeElement);
        
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges(); 
            const range = document.createRange();
            range.selectNodeContents(element); 
            range.collapse(true); // Collapse to the start of the node
            selection.addRange(range);
            console.log(' DIAGNOSTIC: Selection set in element. Range count:', selection.rangeCount);
        } else {
            console.warn(' WARNING: window.getSelection() returned null in focusAndSetCursorAtStart.');
        }
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
            const charStates = []; // Track state of each character
            
            // Initialize characters with random initial states
            for (let y = 0; y < numRows; y++) {
                for (let x = 0; x < numCols; x++) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', `${x * cellWidth}`);
                    text.setAttribute('y', `${y * cellHeight}`);
                    text.setAttribute('font-family', 'Share Tech Mono');
                    text.setAttribute('font-size', '18');
                    text.setAttribute('fill', 'white');
                    
                    // Initialize with random character or space
                    const isSpace = Math.random() > 0.6; // 40% chance of character initially
                    const char = isSpace ? ' ' : waveChars[Math.floor(Math.random() * waveChars.length)];
                    text.textContent = char;
                    
                    // Set initial opacity based on gradient
                    text.setAttribute('opacity', isSpace ? '0' : gradientIntensities[x]);
                    
                    svg.appendChild(text);
                    textElements.push(text);
                    charStates.push({
                        lastChange: 0,
                        isSpace: isSpace,
                        opacity: isSpace ? 0 : 1
                    });
                }
            }

            let lastUpdateTime = 0;
            const UPDATE_INTERVAL = 200; // Slower updates (from 100ms to 200ms)

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
                        
                        const now = Date.now();
                        const state = charStates[index];
                        
                        // Update opacity for smooth transitions
                        if (state.targetOpacity !== undefined) {
                            // Calculate time elapsed since last update
                            const elapsed = now - state.lastUpdate;
                            // Use a consistent 3000ms transition time
                            const transitionDuration = 3000;
                            // Calculate progress (0 to 1)
                            const progress = Math.min(1, elapsed / transitionDuration);
                            
                            // Use ease-in-out function for smoother transition
                            // This creates a more natural, less linear fade
                            const easeInOut = progress => {
                                return progress < 0.5
                                    ? 2 * progress * progress
                                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                            };
                            
                            // Apply easing to progress
                            const easedProgress = easeInOut(progress);
                            
                            // Interpolate between current and target opacity
                            const startOpacity = state.startOpacity || 0;
                            const targetOpacity = state.targetOpacity;
                            state.opacity = startOpacity + (targetOpacity - startOpacity) * easedProgress;
                            
                            // If transition complete, finalize opacity
                            if (progress >= 1) {
                                state.opacity = targetOpacity;
                                delete state.targetOpacity;
                                delete state.startOpacity;
                            }
                        }
                        
                        // Only consider changing if it's been at least 3 seconds since last change
                        if (now - state.lastChange > 3000 && Math.random() < 0.003) {
                            state.isSpace = Math.random() > 0.6; // 40% chance of character
                            const char = state.isSpace ? ' ' : waveChars[Math.floor(Math.random() * waveChars.length)];
                            
                            // Start fade out
                            state.startOpacity = state.opacity || 0;
                            state.targetOpacity = 0;
                            state.lastUpdate = now;
                            
                            // After fade out, change character and fade back in
                            setTimeout(() => {
                                text.textContent = char;
                                state.startOpacity = 0;
                                state.targetOpacity = 1;
                                state.lastUpdate = Date.now();
                                state.lastChange = now;
                            }, 1500); // Half of the 3s transition time
                        }
                        
                        // Apply gradient and current opacity
                        const finalOpacity = gradientIntensities[x] * (state.isSpace ? 0 : (state.opacity || 0));
                        text.setAttribute('opacity', finalOpacity);
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
// Cursor Indicator
// =====================
const CursorIndicator = {
    create() {
        const cursor = document.createElement('span');
        cursor.classList.add('cursor-indicator');
        // Apply the current cursor style from CONFIG
        if (CONFIG.cursorStyle === 'underscore') {
            cursor.classList.add('underscore');
        }
        return cursor;
    },

    attach(element) {
        // Remove any existing cursors first
        this.removeAll();

        const cursor = this.create();
        element.appendChild(cursor);

        // Position the cursor at the end of the text
        this.updatePosition(element, cursor);
        return cursor;
    },

    updatePosition(element, cursor) {
        if (!element || !cursor) return;

        // Get the command line element
        const commandLine = element.querySelector('.command-line') || element;

        // Position cursor at the end of the text
        const textLength = commandLine.textContent.length;
        const textNode = commandLine.firstChild || commandLine;

        // Set position based on text content
        cursor.style.left = (textLength * 8) + 'px'; // Approximate character width

        // Position within the command line
        cursor.style.position = 'absolute';
        cursor.style.top = '50%';
        cursor.style.transform = 'translateY(-50%)';
    },

    remove(cursor) {
        if (cursor && cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    },

    removeAll() {
        const cursors = document.querySelectorAll('.cursor-indicator');
        cursors.forEach(cursor => {
            if (cursor && cursor.parentNode) {
                cursor.parentNode.removeChild(cursor);
            }
        });
    }
};

// =====================
// Terminal Configuration
// Global language setting
window.currentLanguage = 'en';

const CONFIG = {
    version: 'v.0.9',
    username: 'anonymous',
    hostname: 'simplets',
    availableCommands: [
        'about', 'project', 'minting', 'roadmap',
        'team', 'manifesto', 'links', 'legal',
        'video', 'stop', 'language', 'cursor'
    ],
    cursorStyle: 'underscore' // Default cursor style
};

// =====================
// Terminal Menu System
// =====================
const TerminalMenu = {
    show(options, prompt, onSelect, onCancel) {
        const terminalOutput = document.getElementById('terminal-output');
        let selected = 0;
        let menuId = 'menu-' + Date.now();

        function renderMenu() {
            // Remove any existing menu with this ID before rendering
            const existingMenu = document.getElementById(menuId);
            if (existingMenu) existingMenu.remove();

            // Create the menu container
            const menuContainer = document.createElement('div');
            menuContainer.id = menuId;
            menuContainer.className = 'terminal-menu active';

            // Create menu title
            const titleElement = document.createElement('div');
            titleElement.className = 'menu-title';
            titleElement.innerHTML = `<em>${prompt} (Use ↑/↓, Enter to confirm, Esc to cancel):</em>`;
            menuContainer.appendChild(titleElement);

            // Create menu list
            const menuList = document.createElement('ul');
            menuList.className = 'manifesto-menu';

            // Add menu items
            options.forEach((opt, i) => {
                const menuItem = document.createElement('li');
                menuItem.className = 'menu-item' + (i === selected ? ' selected' : '');
                menuItem.innerHTML = opt.label;
                menuList.appendChild(menuItem);
            });

            menuContainer.appendChild(menuList);
            terminalOutput.appendChild(menuContainer);
            Utils.scrollToBottom(terminalOutput);
        }

        function handleSelection() {
            // Get selected value
            const selectedValue = options[selected].value;

            // 1. Remove menu's own event listeners
            document.removeEventListener('keydown', onKeyDown);
            // Make sure to remove the inputBlocker with the correct arguments (true for capture phase)
            document.removeEventListener('keydown', inputBlocker, true);

            // 2. Mark menu as inactive and selected, but keep it on screen
            const menuElement = document.getElementById(menuId);
            if (menuElement) {
                menuElement.className = 'terminal-menu inactive selected'; // Change class instead of removing
                // Optionally, visually mark the actually selected list item if not already done by renderMenu
                const listItems = menuElement.querySelectorAll('.menu-item');
                if (listItems && listItems[selected]) {
                    listItems.forEach(item => item.classList.remove('final-selection')); // Clear previous final marks
                    listItems[selected].classList.add('final-selection'); // Mark the one that was chosen
                }
            }

            // 3. Call the external onSelect callback
            // This callback (from TerminalCommands.process for the manifesto command) is responsible for:
            // - Displaying the manifesto content
            // - Adding the new prompt line via TerminalInput.addPrompt()
            if (onSelect) {
                onSelect(selectedValue, selected);
            }
        }

        // Block all keyboard input during menu (except menu navigation)
        const inputBlocker = e => {
            if (!(e.ctrlKey || e.metaKey) && e.key !== 'Escape' && 
                e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Enter') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        document.addEventListener('keydown', inputBlocker, true);

        // Menu key handler
        const onKeyDown = e => {
            // Allow copy command to work
            if ((e.metaKey || e.ctrlKey) && e.key === 'c') return;

            // Handle menu navigation
            switch(e.key) {
                case 'ArrowUp':
                    selected = (selected - 1 + options.length) % options.length;
                    renderMenu();
                    break;
                case 'ArrowDown':
                    selected = (selected + 1) % options.length;
                    renderMenu();
                    break;
                case 'Enter':
                    handleSelection();
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 'Escape':
                    if (onCancel) onCancel();
                    break;
                default:
                    return; // Ignore other keys
            }

            // Always prevent default for menu keys
            e.preventDefault();
            e.stopPropagation();
        };

        console.log('MENU SHOWN');
        renderMenu();

        // Add a small delay before attaching the keydown listener
        // This prevents the Enter key from the command from triggering the menu selection
        setTimeout(() => {
            document.addEventListener('keydown', onKeyDown);
            console.log('MENU LISTENER ATTACHED');
        }, 100);

        // Cleanup function
        const deactivateMenu = () => {
            document.removeEventListener('keydown', inputBlocker, true);
            document.removeEventListener('keydown', onKeyDown);
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.classList.remove('active');
                menu.classList.add('inactive');
            }
        };

        // Call cleanup when menu is closed
        if (onCancel) {
            const originalOnCancel = onCancel;
            onCancel = () => { 
                deactivateMenu(); 
                originalOnCancel(); 
            };
        }
        
        if (onSelect) {
            const originalOnSelect = onSelect;
            onSelect = (value, index) => { 
                deactivateMenu(); 
                originalOnSelect(value, index); 
            };
        }
    }
};
// Terminal Command Handler
// =====================
const TerminalCommands = {
    // Existing Handler Methods
    handleHelpCommand() {
        return `${getTranslation('availableCommands')}${CONFIG.availableCommands.map(cmd => 
            `<span class="terminal-command">${cmd.toLowerCase()}</span>`
        ).join(', ')}`;
    },
    handleAboutCommand() {
        return getTranslation('commands.about');
    },
    handleStopCommand() {
        this.stopVideo(); 
        return getTranslation('videoStopped');
    },
    handleClearCommand() {
        const terminalOutput = document.getElementById('terminal-output');
        const welcomeLine = terminalOutput.querySelector('.welcome-line');
        terminalOutput.innerHTML = '';
        if (welcomeLine) {
            terminalOutput.appendChild(welcomeLine);
        } else {
            const newWelcome = Utils.createElement('div', ['welcome-line']);
            newWelcome.innerHTML = getTranslation('welcome');
            terminalOutput.appendChild(newWelcome);
        }
        return { menuActive: false, suppressPrompt: true };
    },
    handleVideoCommand(command) {
        return this.playVideo(command);
    },
    handleManifestoCommand() {
        const manifestos = translations[window.currentLanguage || 'en'].commands.manifestos;
        document.querySelectorAll('.command-line').forEach(line => {
            line.contentEditable = 'false';
            line.classList.add('disabled');
        });
        document.querySelectorAll('.cursor-indicator').forEach(cursor => cursor.remove());
        TerminalMenu.show(
            [
                { label: 'Chyperpunk Manifesto', value: manifestos[0] },
                { label: 'Open Access Manifesto', value: manifestos[1] },
                { label: 'SIMPLETS Manifesto', value: manifestos[2] }
            ],
            'Select a Manifesto:',
            (selectedValue) => {
                const terminalOutput = document.getElementById('terminal-output');
                const existingResponse = terminalOutput.querySelector('.manifesto-content');
                if (existingResponse) existingResponse.remove();
                const responseLine = Utils.createElement('div', ['manifesto-content']);
                responseLine.innerHTML = selectedValue.replace(/\n/g, '<br>');
                terminalOutput.appendChild(responseLine);
                TerminalInput.addPrompt(terminalOutput);
                const newCommandLine = terminalOutput.querySelector('.command-line[contenteditable="true"]');
                if (newCommandLine) {
                    Utils.focusAndSetCursorAtStart(newCommandLine);
                } else {
                    console.error(' ERROR: newCommandLine not found after TerminalInput.addPrompt!');
                }
            },
            () => { 
                const terminalOutput = document.getElementById('terminal-output');
                console.log(' DIAGNOSTIC: Manifesto menu onCancel triggered!');
                TerminalInput.addPrompt(terminalOutput);
                const newCommandLine = terminalOutput.querySelector('.command-line[contenteditable="true"]');
                if (newCommandLine) newCommandLine.focus();
            }
        );
        return { menuActive: true };
    },
    handleProjectCommand() {
        const isLight = document.body.classList.contains('light-theme');
        const bgColor = isLight ? 'black' : 'white';
        const indices1 = [Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70), Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70)];
        const indices2 = [Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70), Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 70)];
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
    },
    handleMintingCommand() {
        return getTranslation('commands.minting');
    },
    handleRoadmapCommand() {
        return getTranslation('commands.roadmap');
    },
    handleTeamCommand() {
        return getTranslation('commands.team');
    },
    handleLinksCommand() {
        return getTranslation('commands.links');
    },
    handleLegalCommand() {
        return getTranslation('commands.legal');
    },
    handleLanguageCommand() {
        // This command might be intended to show current lang or options; for now, simple translation
        return getTranslation('commands.language'); 
    },
    handleSetLangCommand(fullCommand) {
        const parts = fullCommand.toLowerCase().trim().split(' '); // Ensure lowercase and split
        const langCode = parts[2]; // command is 'set lang code'
        const validLangCodes = ['en', 'hi', 'zh', 'es', 'pt', 'ru', 'id', 'vi', 'ja', 'tr', 'de', 'fr', 'ar', 'th', 'uk'];
        if (langCode && validLangCodes.includes(langCode)) {
            window.currentLanguage = langCode;
            // It might be good to re-render any language-specific elements or refresh the prompt
            return getTranslation('languageChanged') + langCode;
        } else {
            return getTranslation('invalidLanguage');
        }
    },
    handleCursorCommand() {
        document.querySelectorAll('.command-line').forEach(line => {
            line.contentEditable = 'false';
            line.classList.add('disabled');
        });
        document.querySelectorAll('.cursor-indicator').forEach(cursor => cursor.remove());
        
        // Define cursor options with clear labels
        const blockCursorLabel = 'Block Cursor (■)';
        const underscoreCursorLabel = 'Underscore Cursor (_)';
        
        TerminalMenu.show(
            [
                { label: blockCursorLabel, value: 'block' },
                { label: underscoreCursorLabel, value: 'underscore' }
            ],
            'Select Cursor Style',
            (selectedValue) => {
                // Set the cursor style in CONFIG
                CONFIG.cursorStyle = selectedValue;
                
                // Get the appropriate label based on the selected value
                const selectedLabel = (selectedValue === 'underscore') ? 
                    underscoreCursorLabel : blockCursorLabel;
                
                // Create a new cursor with the selected style
                const newCursor = CursorIndicator.create();
                
                // Update all existing cursors
                document.querySelectorAll('.cursor-indicator').forEach(cursor => {
                    if (CONFIG.cursorStyle === 'underscore') {
                        cursor.classList.add('underscore');
                    } else {
                        cursor.classList.remove('underscore');
                    }
                });
                
                const terminalOutput = document.getElementById('terminal-output');
                const responseLine = Utils.createElement('div');
                responseLine.innerHTML = `Cursor style changed to: <span class="terminal-command">${selectedLabel}</span>`;
                terminalOutput.appendChild(responseLine);
                
                TerminalInput.addPrompt(terminalOutput);
                const newCommandLine = terminalOutput.querySelector('.command-line[contenteditable="true"]');
                if (newCommandLine) {
                    newCommandLine.focus();
                    // Attach the cursor to the command line
                    if (newCommandLine.parentNode) {
                        newCommandLine.parentNode.appendChild(newCursor);
                    }
                }
            },
            () => { 
                const terminalOutput = document.getElementById('terminal-output');
                TerminalInput.addPrompt(terminalOutput);
                const newCommandLine = terminalOutput.querySelector('.command-line[contenteditable="true"]');
                if (newCommandLine) newCommandLine.focus();
            }
        );
        return { menuActive: true };
    },
    handleUnknownCommand(fullCommand) {
        return getTranslation('commandNotFound') + fullCommand.split(' ')[0]; // Show only the command part
    },

    // Fully Populated Command Handlers Map
    commandHandlers: {
        'help': function() { return this.handleHelpCommand(); },
        'clear': function() { return this.handleClearCommand(); },
        'video': function(command) { return this.handleVideoCommand(command); },
        'stop': function() { return this.handleStopCommand(); },
        'about': function() { return this.handleAboutCommand(); },
        'manifesto': function() { return this.handleManifestoCommand(); },
        'project': function() { return this.handleProjectCommand(); },
        'minting': function() { return this.handleMintingCommand(); },
        'roadmap': function() { return this.handleRoadmapCommand(); },
        'team': function() { return this.handleTeamCommand(); },
        'links': function() { return this.handleLinksCommand(); },
        'legal': function() { return this.handleLegalCommand(); },
        'language': function() { return this.handleLanguageCommand(); },
        'cursor': function() { return this.handleCursorCommand(); }
        // 'set' for 'set lang' will be handled in process, unknown handled by handleUnknownCommand
    },

    process(command) {
        const lowercaseCommand = command.toLowerCase().trim();
        const parts = lowercaseCommand.split(' ');
        const baseCommand = parts[0];

        if (baseCommand === 'set' && parts[1] === 'lang' && parts.length === 3) {
            return this.handleSetLangCommand(lowercaseCommand);
        }

        if (this.commandHandlers[baseCommand]) {
            return this.commandHandlers[baseCommand].call(this, command);
        }
        
        return this.handleUnknownCommand(command); // Pass original command for context
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

// ... (rest of the code remains the same)

// =====================
// Terminal Input Handler
// =====================
const TerminalInput = {
    commandHistory: [],
    historyIndex: -1,
    currentInputBuffer: '',
    addPrompt(terminalOutput) {
        // Remove all existing cursors to ensure only one is visible
        document.querySelectorAll('.cursor-indicator').forEach(cursor => cursor.remove());

        const existingActiveLines = document.querySelectorAll('.command-line');
        existingActiveLines.forEach(line => line.contentEditable = 'false');

        const promptLine = Utils.createElement('div', ['prompt-line']);
        promptLine.innerHTML = `
            <span class="user-info">[${CONFIG.username}]</span>:
            <span class="path">~</span>$ 
            <span class="command-line-container">
                <span class="command-line" contenteditable="true"></span>
            </span>
        `;

        terminalOutput.appendChild(promptLine);

        const commandLineContainer = promptLine.querySelector('.command-line-container');
        const commandLine = promptLine.querySelector('.command-line');

        // Add cursor to container with the current style
        const cursor = document.createElement('span');
        cursor.classList.add('cursor-indicator');
        if (CONFIG.cursorStyle === 'underscore') {
            cursor.classList.add('underscore');
        }
        commandLineContainer.appendChild(cursor);

        // Function to update cursor position
        const updateCursorPosition = () => {
            // Create temporary span to measure text width
            const tempSpan = document.createElement('span');
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.style.font = window.getComputedStyle(commandLine).font;
            tempSpan.textContent = commandLine.textContent;
            document.body.appendChild(tempSpan);

            // Position cursor at end of text
            cursor.style.left = `${tempSpan.offsetWidth}px`;
            document.body.removeChild(tempSpan);
        };

        // Update cursor position on input and focus
        commandLine.addEventListener('input', updateCursorPosition);
        commandLine.addEventListener('keydown', updateCursorPosition);
        commandLine.addEventListener('click', updateCursorPosition);

        // Initialize cursor position
        updateCursorPosition();
        commandLine.focus();
        Utils.scrollToBottom(terminalOutput);

        const handleCommand = () => {
            const command = commandLine.textContent.trim();

            // Store cursor state before processing command
            const currentCursor = document.querySelector('.cursor-indicator');

            // Save command to history if not empty or duplicate
            if (command && (TerminalInput.commandHistory.length === 0 || TerminalInput.commandHistory[TerminalInput.commandHistory.length - 1] !== command)) {
                TerminalInput.commandHistory.push(command);
            }
            TerminalInput.historyIndex = -1;
            TerminalInput.currentInputBuffer = '';

            commandLine.contentEditable = 'false';

            if (command) {
                const response = TerminalCommands.process(command);

                if (response?.menuActive) {
                    if (currentCursor) currentCursor.remove();
                    return;
                }

                if (typeof response === 'string') {
                    const responseLine = Utils.createElement('div');
                    responseLine.innerHTML = response.replace(/\n/g, '<br>');
                    terminalOutput.appendChild(responseLine);
                }

                // Skip prompt if command requests it
                if (response?.suppressPrompt) return;
            }

            // Always add new prompt unless in menu mode or suppressed
            if (!command || !TerminalCommands.process(command).menuActive) {
                setTimeout(() => {
                    this.addPrompt(terminalOutput);
                }, 10);
            }

            Utils.scrollToBottom(terminalOutput);
        };

        commandLine.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (TerminalInput.commandHistory.length > 0) {
                    if (TerminalInput.historyIndex === -1) {
                        TerminalInput.currentInputBuffer = commandLine.textContent;
                        TerminalInput.historyIndex = TerminalInput.commandHistory.length - 1;
                    } else if (TerminalInput.historyIndex > 0) {
                        TerminalInput.historyIndex--;
                    }
                    // Always ensure .command-line contains only text
                    commandLine.textContent = TerminalInput.commandHistory[TerminalInput.historyIndex];
                    requestAnimationFrame(() => {
                        Utils.focusAndSetCursorAtEnd(commandLine);
                        Utils.updateVisualCursor(commandLine);
                    });
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (TerminalInput.commandHistory.length > 0 && TerminalInput.historyIndex !== -1) {
                    if (TerminalInput.historyIndex < TerminalInput.commandHistory.length - 1) {
                        TerminalInput.historyIndex++;
                        // Always ensure .command-line contains only text
                        commandLine.textContent = TerminalInput.commandHistory[TerminalInput.historyIndex];
                    } else {
                        TerminalInput.historyIndex = -1;
                        commandLine.textContent = TerminalInput.currentInputBuffer || '';
                    }
                    requestAnimationFrame(() => {
                        Utils.focusAndSetCursorAtEnd(commandLine);
                        Utils.updateVisualCursor(commandLine);
                    });
                }
            }
        });
    },
    initGlobalKeyHandling() {
        document.addEventListener('keydown', (e) => {
            // Allow Cmd+C (or Ctrl+C) for copying text
            if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
                // Don't prevent default or stop propagation - let the browser handle the copy
                return;
            }

            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen.style.display !== 'none') return;

            // If activeElement is an editable command line and it's a normal character, let browser handle it (if menu not active).
            const activeElement = document.activeElement;
            const key = e.key;
            const isChar = key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;

            if (activeElement && activeElement.classList && activeElement.classList.contains('command-line') && 
                activeElement.getAttribute('contenteditable') === 'true' && isChar) {
                
                const menuElement = document.querySelector('.terminal-menu'); 
                if (!menuElement || menuElement.style.display === 'none') {
                    return; 
                }
            }
            
            // DIAGNOSTIC: Log active element before any focus changes
            // console.log('🔍 DIAGNOSTIC: Active element before focus change:', document.activeElement);
            // console.log('🔍 DIAGNOSTIC: Active element is command line?', document.activeElement.classList?.contains('command-line'));
            
            // CRITICAL FIX: Check if we're in a post-manifesto state
            // If there's a manifesto content element and an editable command line after it,
            // we should not redirect input to the last command line
            const manifestoContent = document.querySelector('.manifesto-content');
            // console.log('🔍 DIAGNOSTIC: Manifesto content found?', !!manifestoContent);
            
            if (manifestoContent) {
                // Find all command lines that come after the manifesto content
                const allNodes = Array.from(document.getElementById('terminal-output').childNodes);
                const manifestoIndex = allNodes.indexOf(manifestoContent);
                // console.log('🔍 DIAGNOSTIC: Manifesto index in nodes:', manifestoIndex);
                
                if (manifestoIndex !== -1) {
                    // Look for an editable command line after the manifesto
                    let foundEditableLine = false;
                    for (let i = manifestoIndex + 1; i < allNodes.length; i++) {
                        const node = allNodes[i];
                        // console.log('🔍 DIAGNOSTIC: Checking node after manifesto:', node);
                        
                        const editableLine = node.querySelector?.('.command-line[contenteditable="true"]');
                        if (editableLine) {
                            console.log('🔍 DIAGNOSTIC: Found editable line after manifesto!', editableLine);
                            foundEditableLine = true;
                            
                            // We found an editable line after the manifesto, so we should use that
                            // and not redirect input elsewhere
                            if (!editableLine.matches(':focus') && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
                                console.log('🔍 DIAGNOSTIC: Focusing editable line after manifesto and preparing for input');
                                e.preventDefault();
                                Utils.focusAndSetCursorAtStart(editableLine); // Sets focus and cursor at start
                                // Now insert the character that was typed
                                document.execCommand('insertText', false, e.key); 
                                return;
                            }
                            // If already focused or not a simple character key, let default behavior or other handlers manage.
                            // This prevents interfering with Enter, Tab, etc. if the line is already focused.
                            return; 
                        }
                    }
                    // console.log('🔍 DIAGNOSTIC: Found editable line after manifesto?', foundEditableLine);
                }
            }

            // Original behavior for non-manifesto cases
            const commandLines = document.querySelectorAll('.command-line');
            // console.log('🔍 DIAGNOSTIC: Total command lines found:', commandLines.length);
        
            const lastCommandLine = commandLines[commandLines.length - 1];
            // console.log('🔍 DIAGNOSTIC: Last command line:', lastCommandLine);
            // console.log('🔍 DIAGNOSTIC: Last command line editable?', lastCommandLine?.contentEditable === 'true');
        
            if (lastCommandLine && lastCommandLine.contentEditable !== 'true') {
                console.log('🔍 DIAGNOSTIC: Making last command line editable');
                lastCommandLine.contentEditable = 'true';
            }

            if (!lastCommandLine) {
                console.log('🔍 DIAGNOSTIC: No command line found, adding prompt');
                this.addPrompt(document.getElementById('terminal-output'));
                return;
            }

            if (e.key.length === 1 && !lastCommandLine.matches(':focus')) {
                console.log('🔍 DIAGNOSTIC: Redirecting input to last command line');
                e.preventDefault();
                lastCommandLine.focus();

                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                    console.log('🔍 DIAGNOSTIC: Adding key to last command line:', e.key);
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
    },
    handleInput(e) {
        const cursor = e.target.querySelector('.cursor-indicator');
        if (cursor) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(e.target, e.target.childNodes.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = e.target.textContent.trim();
            TerminalCommands.process(command);
            e.target.contentEditable = 'false';
            TerminalInput.addPrompt(document.getElementById('terminal-output'));
        }
    }
};

// ... (rest of the code remains the same)

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
    const terminalInput = document.getElementById('terminal-input');
    const terminalInputArea = document.getElementById('terminal-input-area');

    asciiArtElement.textContent = asciiArt;

    const animateLoadingScreen = () => {
        setTimeout(() => {
            const logo = document.getElementById('logo');
            if (logo) logo.style.opacity = '1';
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

// Helper function for terminal logo click
function handleTerminalLogoClick() {
    const terminalOutput = document.getElementById('terminal-output');
    // Save current scroll position
    const scrollTop = terminalOutput.scrollTop;

    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');

    updateAllThemeSVGs();

    const currentTheme = document.body.classList.contains('light-theme') ? 'Light' : 'Dark';
    const aboutMessage = `${getTranslation('currentTheme')}${currentTheme}`;

    const responseLine = Utils.createElement('div');
    responseLine.innerHTML = aboutMessage;
    terminalOutput.appendChild(responseLine);

    TerminalInput.addPrompt(terminalOutput);
    // Restore previous scroll position
    terminalOutput.scrollTop = scrollTop;
}

// Helper function to set up the terminal interface after loading
function isMobile() {
    return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
}

function setupTerminalInterface() {
    loadingScreen.style.display = 'none';

    // MOBILE: Only show a constant about message and skip welcome/terminal
    if (isMobile()) {
        // Hide terminal and show mobile message
        document.getElementById('terminal').style.display = 'none';
        let mobileMsg = document.getElementById('mobile-message');
        if (!mobileMsg) {
            mobileMsg = document.createElement('div');
            mobileMsg.id = 'mobile-message';
            mobileMsg.innerHTML = `
                <strong>SIMPLETS is the cult of digital awakening:</strong><br>
                An underground and experimental DeSoc journey.<br>
                Designed around free speech and pseudonym friendly values.<br>
                A convergence where A.I. and creative souls unite.<br>
                Built by codes, from character to character.<br><br>
                <em>For the full CLI experience, please open this site on a desktop device.</em>
            `;
            document.body.appendChild(mobileMsg);
        } else {
            mobileMsg.style.display = 'block';
        }
        return;
    }
    // Desktop: show welcome message as usual
    const welcomeMessage = Utils.createElement('div', ['welcome-line']);
    welcomeMessage.innerHTML = getTranslation('welcome');
    terminalOutput.appendChild(welcomeMessage);

    const terminalLogo = Utils.createElement('div', [], '□_□');
    terminalLogo.id = 'terminal-logo';

    terminalLogo.addEventListener('click', handleTerminalLogoClick);

    terminal.appendChild(terminalLogo);

    setTimeout(() => {
        if (terminalLogo) terminalLogo.style.opacity = '1';
    }, 1500);

    WaveAnimation.create(terminal);

    TerminalInput.addPrompt(terminalOutput);
    TerminalInput.initGlobalKeyHandling();

    // We'll add the cursor indicator to the command line instead of the input area
    setTimeout(() => {
        const commandLine = document.querySelector('.command-line[contenteditable="true"]');
        if (commandLine) {
            // Only add cursor if it doesn't exist yet
            if (!document.querySelector('.cursor-indicator')) {
                const cursorElement = CursorIndicator.create();
                commandLine.parentNode.appendChild(cursorElement);
            }
        }
    }, 100);

    const terminalOutputElement = document.getElementById('terminal-output');
    terminalOutputElement.style.opacity = '0';
    terminalOutputElement.style.transform = 'translateY(20px)';

    setTimeout(() => {
        terminalOutputElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        terminalOutputElement.style.opacity = '1';
        terminalOutputElement.style.transform = 'translateY(0)';
    }, 500);
}

const transitionToTerminal = () => {
    clearInterval(loadingInterval);
    loadingScreen.classList.add('fade-out');
    setTimeout(setupTerminalInterface, 1000);
};

    setTimeout(transitionToTerminal, 4000);

    const versionDiv = document.getElementById('version-display');
    if (versionDiv) versionDiv.textContent = `Version: ${CONFIG.version}`;
});