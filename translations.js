// =====================
// Translation System
// =====================

// Translation data structure
const translations = {
    // English (default)
    en: {
        welcome: 'Welcome to the abyss. Type <span class="terminal-command">help</span> to interact.',
        commandNotFound: 'Command not found: ',
        availableCommands: 'Available commands: ',
        videoStopped: 'Video stopped. Returning to normal CLI view.',
        videoThemeWarning: 'WARNING: Please switch to dark theme before playing video. Use theme toggle to switch.',
        currentTheme: 'Current Theme: ',
        languageChanged: 'Language successfully changed to: ',
        invalidLanguage: 'Invalid language code. Use the \'language\' command to see available options.',
        
        // Command responses
        commands: {
            about: `
<strong>SIMPLETS: Redefining Terminal Experience</strong><br>
SIMPLETS is an innovative terminal interface that blends cutting-edge technology with a minimalist, immersive design. Our mission is to transform how developers and tech enthusiasts interact with their digital environment.
            `,
            manifesto: `
<strong>SIMPLETS Manifesto</strong><br>
SIMPLETS is the cult of digital awakening:<br>
built by codes, from character to character.<br><br>
We do not seek trends. We analyze data, exploring the deep layers of <br>
a multichain existence.<br><br>
Our purpose is to uncover the patterns that<br>
others overlook.<br><br>
We do not serve systems; we question them.<br><br>
Join us if you are ready to rewrite your future. But remember:<br>
once you become a holder, your reality may change forever.
            `,
            manifestos: [
                `<strong>Chyperpunk Manifesto</strong><br>
                Chyperpunk is the fusion of chains, hyperconnectivity, and punk ethos.<br>
                We believe in radical transparency, decentralized collaboration, and creative rebellion.<br><br>
                Our code is open, our minds are free, our networks are unstoppable.<br>
                Join the chyperpunk movement and help shape the future of digital society.`,
                
                `<strong>Open Access Manifesto</strong><br>
                Knowledge wants to be free.<br>
                We support open access to information, open source software, and the removal of barriers to learning and innovation.<br><br>
                Everyone should have the right to read, write, build, and share.<br>
                Join us in creating a world where ideas flow without restriction.`,
                
                `<strong>SIMPLETS Manifesto</strong><br>
                SIMPLETS is the cult of digital awakening:<br>
                built by codes, from character to character.<br><br>
                We do not seek trends. We analyze data, exploring the deep layers of <br>
                a multichain existence.<br><br>
                Our purpose is to uncover the patterns that<br>
                others overlook.<br><br>
                We do not serve systems; we question them.<br><br>
                Join us if you are ready to rewrite your future. But remember:<br>
                once you become a holder, your reality may change forever.`
            ],
            minting: `
<strong>SIMPLETS Minting</strong><br>
- <span class="terminal-command">Total Supply</span>: 10,000 unique terminal interfaces<br>
- <span class="terminal-command">Mint Price</span>: 0.069 ETH<br>
- <span class="terminal-command">Blockchain</span>: Ethereum<br>
- <span class="terminal-command">Smart Contract</span>: In development<br>
- <span class="terminal-command">Whitelist</span>: Coming soon<br>
Minting will grant exclusive access to advanced terminal features.
            `,
            roadmap: `<pre style="margin:0; line-height:1.35;">
Roadmap Tree:
├── NFTs
│   └── Initial Collection Launch
├── Community
│   ├── Guild.xyz Integration
│   ├── DAO Setup
│   └── Raves
├── Infrastructure
│   ├── Custom Marketplace Development
│   ├── Merch Store
│   └── Swarm Network (Eliza OS)
├── Content
│   ├── Podcasts
│   └── Media Hacks
├── Ecosystem
│   └── Strategic Partnerships
└── Tokenomics
    ├── Potential Airdrops
    └── Future Coin Launch
</pre>
This roadmap is a flexible plan and not a guarantee. Community input and collective intention may shape its direction over time.
            `,
            team: `
<strong>SIMPLETS Team</strong><br>
- <span class="terminal-command">Founder</span>: Anonymous Developer (0xABCD...)<br>
- <span class="terminal-command">Lead Designer</span>: UI/UX Minimalist<br>
- <span class="terminal-command">Lead Developer</span>: Full-Stack Innovator<br>
- <span class="terminal-command">Community Manager</span>: Tech Enthusiast<br>
</span>
We are a collective of developers passionate about reimagining digital interfaces.
            `,
            links: `
<strong>SIMPLETS Links</strong><br>
<span style="font-size:0.97em;">
- <span class="terminal-command">Website</span>: https://simplets.tech<br>
- <span class="terminal-command">GitHub</span>: https://github.com/simplets-git<br>
- <span class="terminal-command">Twitter</span>: @SIMPLETS_tech<br>
- <span class="terminal-command">Discord</span>: discord.gg/simplets<br>
- <span class="terminal-command">Email</span>: contact@simplets.tech<br>
</span>
            `,
            legal: `
<strong>Legal Notice</strong><br>
<ul style="font-size:0.97em; margin:0 0 0 1.2em; padding:0; line-height:1.45;">
<li><span class="terminal-command">SIMPLETS is a VPL (Virtual Public License) project.</span></li>
<li>The project is primarily community-led; direction and development may evolve based on collective input.</li>
<li>By using, interacting with, minting, or contributing to SIMPLETS, you do so entirely at your own risk.</li>
<li>There are no guarantees, warranties, or promises of functionality, value, or outcome.</li>
<li><span class="terminal-command">"Code is law"</span>: all interactions and contributions are governed by the codebase as it exists on-chain and in this repository.</li>
<li>No individual or entity is liable for any loss, damages, or consequences arising from your participation.</li>
<li><b>This is an experimental, creative digital project. Not financial or legal advice.</b></li>
</ul>
<span style="font-size:0.97em;">For questions or concerns, reach out to the community or project maintainers directly.</span>
            `,
            language: `
<strong>SIMPLETS Language Settings</strong><br>
<span style="font-size:0.97em;">
Available languages:
<ul style="margin:0.5em 0 0.8em 1.2em; padding:0;">
<li><span class="terminal-command">en</span> - English</li>
<li><span class="terminal-command">hi</span> - Hindi (India)</li>
<li><span class="terminal-command">zh</span> - Chinese</li>
<li><span class="terminal-command">es</span> - Spanish</li>
<li><span class="terminal-command">pt</span> - Portuguese (Brazil)</li>
<li><span class="terminal-command">ru</span> - Russian</li>
<li><span class="terminal-command">id</span> - Indonesian</li>
<li><span class="terminal-command">vi</span> - Vietnamese</li>
<li><span class="terminal-command">ja</span> - Japanese</li>
<li><span class="terminal-command">tr</span> - Turkish</li>
<li><span class="terminal-command">de</span> - German</li>
<li><span class="terminal-command">fr</span> - French</li>
<li><span class="terminal-command">ar</span> - Arabic</li>
<li><span class="terminal-command">th</span> - Thai</li>
<li><span class="terminal-command">uk</span> - Ukrainian</li>
</ul>
</span>
<span style="font-size:0.97em;">
To change the language, use the hidden terminal command: <span class="terminal-command">set lang [code]</span><br>
Example: <span class="terminal-command">set lang de</span> to set language to German
</span>
<span style="font-size:0.97em;">
<br>Current language: <span class="terminal-command">${window.currentLanguage}</span>
</span>
            `
        }
    },
    
    // German example (you would add more languages following this pattern)
    de: {
        welcome: 'Willkommen in der Tiefe. Geben Sie <span class="terminal-command">help</span> ein, um zu interagieren.',
        commandNotFound: 'Befehl nicht gefunden: ',
        availableCommands: 'Verfügbare Befehle: ',
        videoStopped: 'Video gestoppt. Zurück zur normalen CLI-Ansicht.',
        videoThemeWarning: 'WARNUNG: Bitte wechseln Sie zum dunklen Thema, bevor Sie das Video abspielen. Verwenden Sie den Themen-Umschalter.',
        currentTheme: 'Aktuelles Thema: ',
        languageChanged: 'Sprache erfolgreich geändert zu: ',
        invalidLanguage: 'Ungültiger Sprachcode. Verwenden Sie den Befehl \'language\', um die verfügbaren Optionen zu sehen.',
        
        // Command responses
        commands: {
            about: `
<strong>SIMPLETS: Neudefinition der Terminal-Erfahrung</strong><br>
<span style="font-size:0.97em;">
SIMPLETS ist eine innovative Terminal-Schnittstelle, die modernste Technologie mit einem minimalistischen, immersiven Design verbindet. Unsere Mission ist es, die Art und Weise zu verändern, wie Entwickler und Technik-Enthusiasten mit ihrer digitalen Umgebung interagieren.
</span>
            `,
            manifesto: `
<strong>SIMPLETS Manifest</strong><br>
<span style="font-size:0.97em;">
SIMPLETS ist der Kult des digitalen Erwachens:<br>
gebaut durch Codes, von Zeichen zu Zeichen.<br><br>
Wir suchen keine Trends. Wir analysieren Daten und erforschen die tiefen Schichten<br>
einer Multichain-Existenz.<br><br>
Unser Ziel ist es, die Muster aufzudecken, die<br>
andere übersehen.<br><br>
Wir dienen nicht Systemen; wir hinterfragen sie.<br><br>
Schließen Sie sich uns an, wenn Sie bereit sind, Ihre Zukunft neu zu schreiben. Aber denken Sie daran:<br>
Sobald Sie ein Inhaber werden, könnte sich Ihre Realität für immer verändern.
</span>
            `,
            minting: `
<strong>SIMPLETS Prägung</strong><br>
<span style="font-size:0.97em;">
- <span class="terminal-command">Gesamtangebot</span>: 10.000 einzigartige Terminal-Schnittstellen<br>
- <span class="terminal-command">Prägepreis</span>: 0,069 ETH<br>
- <span class="terminal-command">Blockchain</span>: Ethereum<br>
- <span class="terminal-command">Smart Contract</span>: In Entwicklung<br>
- <span class="terminal-command">Whitelist</span>: Demnächst<br>
</span>
Die Prägung gewährt exklusiven Zugang zu erweiterten Terminal-Funktionen.
            `,
            roadmap: `
<strong>SIMPLETS Roadmap</strong><br>
<pre style="font-size: 0.97em; margin:0; line-height:1.35;">
SIMPLETS Roadmap-Baum:
├── NFTs
│   └── Start der ersten Kollektion
├── Gemeinschaft
│   ├── Guild.xyz Integration
│   ├── DAO-Einrichtung
│   └── Raves
├── Infrastruktur
│   ├── Entwicklung eines benutzerdefinierten Marktplatzes
│   ├── Merchandise-Shop
│   └── Swarm-Netzwerk (Eliza OS)
├── Inhalt
│   ├── Podcasts
│   └── Medien-Hacks
├── Ökosystem
│   └── Strategische Partnerschaften
└── Tokenomics
    ├── Potenzielle Airdrops
    └── Zukünftiger Coin-Launch
</pre>
<span style="font-size:0.97em;">Diese Roadmap ist ein flexibler Plan und keine Garantie. Der Input der Community und die kollektive Absicht können ihre Richtung im Laufe der Zeit beeinflussen.</span>
            `,
            team: `
<strong>SIMPLETS Team</strong><br>
<span style="font-size:0.97em;">
- <span class="terminal-command">Gründer</span>: Anonymer Entwickler (0xABCD...)<br>
- <span class="terminal-command">Lead Designer</span>: UI/UX-Minimalist<br>
- <span class="terminal-command">Lead-Entwickler</span>: Full-Stack-Innovator<br>
- <span class="terminal-command">Community-Manager</span>: Technik-Enthusiast<br>
</span>
Wir sind ein Kollektiv von Entwicklern, die leidenschaftlich daran arbeiten, digitale Schnittstellen neu zu gestalten.
            `,
            links: `
<strong>SIMPLETS Links</strong><br>
<span style="font-size:0.97em;">
- <span class="terminal-command">Website</span>: https://simplets.tech<br>
- <span class="terminal-command">GitHub</span>: https://github.com/simplets-git<br>
- <span class="terminal-command">Twitter</span>: @SIMPLETS_tech<br>
- <span class="terminal-command">Discord</span>: discord.gg/simplets<br>
- <span class="terminal-command">E-Mail</span>: contact@simplets.tech<br>
</span>
            `,
            legal: `
<strong>Rechtlicher Hinweis</strong><br>
<ul style="font-size:0.97em; margin:0 0 0 1.2em; padding:0; line-height:1.45;">
<li><span class="terminal-command">SIMPLETS ist ein VPL-Projekt (Virtual Public License).</span></li>
<li>Das Projekt wird hauptsächlich von der Community geleitet; Richtung und Entwicklung können sich basierend auf kollektivem Input entwickeln.</li>
<li>Durch die Nutzung, Interaktion, Prägung oder Beitrag zu SIMPLETS tun Sie dies vollständig auf eigenes Risiko.</li>
<li>Es gibt keine Garantien, Gewährleistungen oder Versprechen hinsichtlich Funktionalität, Wert oder Ergebnis.</li>
<li><span class="terminal-command">"Code ist Gesetz"</span>: alle Interaktionen und Beiträge werden durch die Codebasis geregelt, wie sie on-chain und in diesem Repository existiert.</li>
<li>Keine Einzelperson oder Einheit haftet für Verluste, Schäden oder Konsequenzen, die aus Ihrer Teilnahme entstehen.</li>
<li><b>Dies ist ein experimentelles, kreatives digitales Projekt. Keine Finanz- oder Rechtsberatung.</b></li>
</ul>
<span style="font-size:0.97em;">Bei Fragen oder Bedenken wenden Sie sich direkt an die Community oder die Projektbetreuer.</span>
            `,
            language: `
<strong>SIMPLETS Spracheinstellungen</strong><br>
<span style="font-size:0.97em;">
Verfügbare Sprachen:
<ul style="margin:0.5em 0 0.8em 1.2em; padding:0;">
<li><span class="terminal-command">en</span> - Englisch</li>
<li><span class="terminal-command">hi</span> - Hindi (Indien)</li>
<li><span class="terminal-command">zh</span> - Chinesisch</li>
<li><span class="terminal-command">es</span> - Spanisch</li>
<li><span class="terminal-command">pt</span> - Portugiesisch (Brasilien)</li>
<li><span class="terminal-command">ru</span> - Russisch</li>
<li><span class="terminal-command">id</span> - Indonesisch</li>
<li><span class="terminal-command">vi</span> - Vietnamesisch</li>
<li><span class="terminal-command">ja</span> - Japanisch</li>
<li><span class="terminal-command">tr</span> - Türkisch</li>
<li><span class="terminal-command">de</span> - Deutsch</li>
<li><span class="terminal-command">fr</span> - Französisch</li>
<li><span class="terminal-command">ar</span> - Arabisch</li>
<li><span class="terminal-command">th</span> - Thailändisch</li>
<li><span class="terminal-command">uk</span> - Ukrainisch</li>
</ul>
</span>
<span style="font-size:0.97em;">
Um die Sprache zu ändern, verwenden Sie den versteckten Terminal-Befehl: <span class="terminal-command">set lang [code]</span><br>
Beispiel: <span class="terminal-command">set lang de</span> um die Sprache auf Deutsch zu setzen
</span>
<span style="font-size:0.97em;">
<br>Aktuelle Sprache: <span class="terminal-command">${window.currentLanguage}</span>
</span>
            `
        }
    }
    
    // Add more languages here following the same structure
    // Example: zh, es, pt, ru, etc.
};

// Translation function
function getTranslation(key, params = {}) {
    const lang = window.currentLanguage || 'en';
    
    // Get the translation object for the current language, fallback to English
    const langData = translations[lang] || translations.en;
    
    // Handle nested keys (e.g., 'commands.about')
    const keys = key.split('.');
    let result = langData;
    
    // Navigate through the nested structure
    for (const k of keys) {
        if (result && result[k]) {
            result = result[k];
        } else {
            // If translation not found, fallback to English
            let fallback = translations.en;
            for (const k of keys) {
                if (fallback && fallback[k]) {
                    fallback = fallback[k];
                } else {
                    return key; // Last resort fallback is the key itself
                }
            }
            result = fallback;
            break;
        }
    }
    
    // Replace any parameters in the translation string
    if (typeof result === 'string') {
        Object.keys(params).forEach(param => {
            result = result.replace(`\${${param}}`, params[param]);
        });
    }
    
    return result;
}

// Export the translation function
window.getTranslation = getTranslation;
