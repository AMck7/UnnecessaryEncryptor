// Toggle extra methods functionality
function toggleExtraMethods(event) {
    event.preventDefault();
    const extraSection = document.getElementById('extra-methods-section');
    const toggleLink = document.getElementById('toggle-extra-methods');
    
    if (extraSection.style.display === 'none') {
        extraSection.style.display = 'block';
        toggleLink.textContent = 'Hide extra annoying methods';
    } else {
        extraSection.style.display = 'none';
        toggleLink.textContent = 'Show extra annoying methods';
    }
}

// Encryption algorithms
const EncryptionMethods = {
    // ROT13
    rot13: {
        encrypt: (text) => {
            return text.replace(/[a-zA-Z]/g, char => {
                const start = char <= 'Z' ? 65 : 97;
                return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
            });
        },
        decrypt: (text) => EncryptionMethods.rot13.encrypt(text) // ROT13 is self-inverse
    },

    // Atbash cipher (A=Z, B=Y, etc.)
    atbash: {
        encrypt: (text) => {
            return text.split('').map(char => {
                if (/[a-zA-Z]/.test(char)) {
                    const start = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode((25 - (char.charCodeAt(0) - start)) + start);
                }
                return char;
            }).join('');
        },
        decrypt: (text) => EncryptionMethods.atbash.encrypt(text) // Atbash is self-inverse
    },

    // Custom substitution cipher
    substitution: {
        encrypt: (text) => {
            const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const cipher = 'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210';
            return text.split('').map(char => {
                const index = normal.indexOf(char);
                return index !== -1 ? cipher[index] : char;
            }).join('');
        },
        decrypt: (text) => {
            const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const cipher = 'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210';
            return text.split('').map(char => {
                const index = cipher.indexOf(char);
                return index !== -1 ? normal[index] : char;
            }).join('');
        }
    },

    // Simple text reversal
    reverse: {
        encrypt: (text) => text.split('').reverse().join(''),
        decrypt: (text) => text.split('').reverse().join('') // Reverse is self-inverse
    },

    // Morse code (preserves some case info)
    morse: {
        encrypt: (text) => {
            const morseMap = {
                'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
                '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
                '8': '---..', '9': '----.', ' ': '/'
            };
            
            return text.split('').map(char => {
                const upper = char.toUpperCase();
                const morse = morseMap[upper];
                if (morse) {
                    // Add prefix to indicate original case
                    return char === upper ? morse : '^' + morse;
                }
                return char;
            }).join(' ');
        },
        decrypt: (text) => {
            const morseMap = {
                '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
                '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
                '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
                '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
                '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
                '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
                '---..': '8', '----.': '9', '/': ' '
            };
            
            return text.split(' ').map(code => {
                if (code.startsWith('^')) {
                    // Was lowercase
                    const morse = code.substring(1);
                    const char = morseMap[morse];
                    return char ? char.toLowerCase() : code;
                } else {
                    // Was uppercase or other
                    return morseMap[code] || code;
                }
            }).join('');
        }
    },

    // Binary encoding
    binary: {
        encrypt: (text) => {
            return text.split('').map(char => 
                char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join(' ');
        },
        decrypt: (text) => {
            // Check if text looks like binary (contains only 0, 1, and spaces)
            if (!/^[01\s]+$/.test(text.trim())) {
                throw new Error("Invalid binary format");
            }
            
            const binaryParts = text.split(' ').filter(bin => bin.length > 0);
            
            // Check if all parts are valid 8-bit binary
            for (let bin of binaryParts) {
                if (bin.length !== 8 || !/^[01]+$/.test(bin)) {
                    throw new Error("Invalid binary format");
                }
            }
            
            return binaryParts.map(bin => 
                String.fromCharCode(parseInt(bin, 2))
            ).join('');
        }
    },

    // Base64 encoding
    base64: {
        encrypt: (text) => btoa(unescape(encodeURIComponent(text))),
        decrypt: (text) => {
            try {
                return decodeURIComponent(escape(atob(text)));
            } catch {
                throw new Error("Invalid base64");
            }
        }
    },

    // Hexadecimal encoding
    hex: {
        encrypt: (text) => {
            return text.split('').map(char => 
                char.charCodeAt(0).toString(16).padStart(2, '0')
            ).join('');
        },
        decrypt: (text) => {
            // Check if text is valid hex (even length, only hex characters)
            if (text.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(text)) {
                throw new Error("Invalid hex format");
            }
            
            const hex = text.match(/.{1,2}/g) || [];
            return hex.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        }
    },

    // URL encoding
    url: {
        encrypt: (text) => encodeURIComponent(text),
        decrypt: (text) => decodeURIComponent(text)
    }
};

// Get selected encryption methods
function getSelectedMethods() {
    const methods = [];
    const methodIds = ['rot13', 'atbash', 'substitution', 'reverse', 'morse', 'binary', 'url', 'base64', 'hex'];
    
    methodIds.forEach(method => {
        const checkbox = document.getElementById(method + '-check');
        if (checkbox && checkbox.checked) {
            methods.push(method);
        }
    });
    
    return methods;
}

function encrypt() {
    const inputText = document.getElementById('input-text').value;
    if (!inputText.trim()) {
        alert('Please enter a message to encrypt!');
        return;
    }

    const selectedMethods = getSelectedMethods();
    if (selectedMethods.length === 0) {
        alert('Please select at least one encryption method!');
        return;
    }

    let result = inputText;
    const steps = [];
    const outputTextarea = document.getElementById('output-text');
    
    outputTextarea.classList.add('processing');

    try {
        selectedMethods.forEach((method, index) => {
            const before = result;
            result = EncryptionMethods[method].encrypt(result);
            steps.push({
                step: index + 1,
                method: method.toUpperCase(),
                input: before,
                output: result
            });
        });

        document.getElementById('output-text').value = result;
        displaySteps(steps, 'Encryption');
        
        // Show the copy button when there's output
        document.querySelector('.copy-btn').classList.add('show');
        
    } catch (error) {
        alert('Encryption failed: ' + error.message);
    } finally {
        outputTextarea.classList.remove('processing');
    }
}

function decrypt() {
    const inputText = document.getElementById('input-text').value;
    if (!inputText.trim()) {
        alert('Please enter encrypted text to decrypt!');
        return;
    }

    const selectedMethods = getSelectedMethods();
    if (selectedMethods.length === 0) {
        alert('Please select at least one encryption method!');
        return;
    }

    const outputTextarea = document.getElementById('output-text');
    outputTextarea.classList.add('processing');

    try {
        // Try reverse order first (most common case)
        const reverseOrder = [...selectedMethods].reverse();
        let result = attemptDecryptionWithOrder(inputText, reverseOrder);

        if (result.success) {
            document.getElementById('output-text').value = result.text;
            displaySteps(result.steps, 'Decryption');
            document.querySelector('.copy-btn').classList.add('show');
            
            // Only show warning if final result is empty AND no methods were actually applied
            if ((!result.text || result.text.trim() === '') && result.text === inputText) {
                alert('Decryption failed: The result is empty. This usually means the wrong encryption methods were selected or the input was not properly encrypted with these methods.');
            }
        } else {
            // If reverse order fails, try original order
            result = attemptDecryptionWithOrder(inputText, selectedMethods);
            if (result.success) {
                document.getElementById('output-text').value = result.text;
                displaySteps(result.steps, 'Decryption');
                document.querySelector('.copy-btn').classList.add('show');
                
                // Only show warning if final result is empty AND no methods were actually applied
                if ((!result.text || result.text.trim() === '') && result.text === inputText) {
                    alert('Decryption failed: The result is empty. This usually means the wrong encryption methods were selected or the input was not properly encrypted with these methods.');
                }
            } else {
                alert('Decryption failed: One or more decryption steps failed.\n\nTip: Make sure you select the same encryption methods that were used to encrypt the text.');
            }
        }
        
    } catch (error) {
        alert('Decryption failed: ' + error.message);
    } finally {
        outputTextarea.classList.remove('processing');
    }
}

// Try decryption with a specific order - just apply all methods
function attemptDecryptionWithOrder(text, methodOrder) {
    try {
        let result = text;
        const steps = [];
        
        for (let i = 0; i < methodOrder.length; i++) {
            const method = methodOrder[i];
            const before = result;

            try {
                result = EncryptionMethods[method].decrypt(result);
                
                // If result is empty or only whitespace, skip this method and continue with original input
                if (!result || result.trim() === '') {
                    result = before; // Keep the input unchanged
                    steps.push({
                        step: i + 1,
                        method: method.toUpperCase() + ' (SKIPPED)',
                        input: before,
                        output: before + ' (method skipped due to empty result)'
                    });
                } else {
                    steps.push({
                        step: i + 1,
                        method: method.toUpperCase(),
                        input: before,
                        output: result
                    });
                }
            } catch (e) {
                // If decryption fails (e.g., invalid format), skip this method and continue with original input
                result = before; // Keep the input unchanged
                steps.push({
                    step: i + 1,
                    method: method.toUpperCase() + ' (SKIPPED)',
                    input: before,
                    output: before + ' (method skipped - invalid format for this method)'
                });
            }
        }
        
        // If we got through all methods without error, it worked
        return {
            success: true,
            text: result,
            steps: steps
        };
    } catch (e) {
        return { success: false };
    }
}

function displaySteps(steps, type) {
    const stepsContent = document.getElementById('steps-content');
    const toggleBtn = document.querySelector('.toggle-steps-btn');
    
    stepsContent.innerHTML = '';

    // Reset to collapsed state and show the button
    stepsContent.className = 'steps-content-collapsed';
    toggleBtn.textContent = `🔍 Show Steps`;
    toggleBtn.classList.add('show');

    steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `
            <div class="step-title">Step ${step.step}: ${step.method}</div>
            <div class="step-content">
                <strong>Input:</strong> ${truncateText(step.input, 100)}<br>
                <strong>Output:</strong> ${truncateText(step.output, 100)}
            </div>
        `;
        stepsContent.appendChild(stepDiv);
    });
}

function toggleSteps() {
    const stepsContent = document.getElementById('steps-content');
    const toggleBtn = document.querySelector('.toggle-steps-btn');

    if (stepsContent.className === 'steps-content-collapsed') {
        stepsContent.className = 'steps-content-expanded';
        toggleBtn.textContent = '🔍 Hide Steps';
    } else {
        stepsContent.className = 'steps-content-collapsed';
        toggleBtn.textContent = '🔍 Show Steps';
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function selectAllMethods() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function clearAllMethods() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function clearAll() {
    document.getElementById('input-text').value = '';
    document.getElementById('output-text').value = '';
    document.querySelector('.toggle-steps-btn').classList.remove('show');
    document.querySelector('.copy-btn').classList.remove('show');
    document.getElementById('steps-content').className = 'steps-content-collapsed';
}

function copyToClipboard() {
    const outputText = document.getElementById('output-text');
    if (!outputText.value) {
        alert('Nothing to copy!');
        return;
    }
    
    outputText.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    copyBtn.style.background = '#28a745';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#28a745';
    }, 2000);
}

// Easter egg: Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konami.join('')) {
        document.body.style.animation = 'glow 0.5s ease-in-out 5';
        alert('🎉 MEGA ENCRYPTION MASTER MODE ACTIVATED! 🎉\n(Nothing actually changed, but you found the easter egg!)');
    }
});

// Auto-resize textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(120, this.scrollHeight) + 'px';
    });
});
