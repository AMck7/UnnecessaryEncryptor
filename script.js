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

const EncryptionMethods = {
    rot13: {
        encrypt: (text) => {
            return text.replace(/[a-zA-Z]/g, char => {
                const start = char <= 'Z' ? 65 : 97;
                return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
            });        },
        decrypt: (text) => EncryptionMethods.rot13.encrypt(text)
    },

    atbash: {
        encrypt: (text) => {
            return text.split('').map(char => {
                if (/[a-zA-Z]/.test(char)) {
                    const start = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode((25 - (char.charCodeAt(0) - start)) + start);
                }
                return char;
            }).join('');        },
        decrypt: (text) => EncryptionMethods.atbash.encrypt(text)
    },

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
        }    },

    reverse: {        encrypt: (text) => text.split('').reverse().join(''),
        decrypt: (text) => text.split('').reverse().join('')
    },

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
                    const morse = code.substring(1);
                    const char = morseMap[morse];
                    return char ? char.toLowerCase() : code;
                } else {
                    return morseMap[code] || code;
                }
            }).join('');
        }    },

    binary: {
        encrypt: (text) => {
            return text.split('').map(char => 
                char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join(' ');        },
        decrypt: (text) => {
            if (!/^[01\s]+$/.test(text.trim())) {
                throw new Error("Invalid binary format");
            }
            
            const binaryParts = text.split(' ').filter(bin => bin.length > 0);
            
            for (let bin of binaryParts) {
                if (bin.length !== 8 || !/^[01]+$/.test(bin)) {
                    throw new Error("Invalid binary format");
                }
            }
            
            return binaryParts.map(bin => 
                String.fromCharCode(parseInt(bin, 2))
            ).join('');
        }    },

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

    hex: {
        encrypt: (text) => {
            return text.split('').map(char => 
                char.charCodeAt(0).toString(16).padStart(2, '0')
            ).join('');
        },
        decrypt: (text) => {
            if (text.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(text)) {
                throw new Error("Invalid hex format");
            }
            
            const hex = text.match(/.{1,2}/g) || [];
            return hex.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        }
    },

    url: {
        encrypt: (text) => encodeURIComponent(text),
        decrypt: (text) => decodeURIComponent(text)
    }
};

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
        const reverseOrder = [...selectedMethods].reverse();
        let result = attemptDecryptionWithOrder(inputText, reverseOrder);

        if (result.success) {
            document.getElementById('output-text').value = result.text;
            displaySteps(result.steps, 'Decryption');
            document.querySelector('.copy-btn').classList.add('show');
            
            if ((!result.text || result.text.trim() === '') && result.text === inputText) {
                alert('Decryption failed: The result is empty. This usually means the wrong encryption methods were selected or the input was not properly encrypted with these methods.');
            }
        } else {
            result = attemptDecryptionWithOrder(inputText, selectedMethods);
            if (result.success) {
                document.getElementById('output-text').value = result.text;
                displaySteps(result.steps, 'Decryption');
                document.querySelector('.copy-btn').classList.add('show');
                
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

function attemptDecryptionWithOrder(text, methodOrder) {
    try {
        let result = text;
        const steps = [];
        
        for (let i = 0; i < methodOrder.length; i++) {
            const method = methodOrder[i];
            const before = result;

            try {
                result = EncryptionMethods[method].decrypt(result);
                
                if (!result || result.trim() === '') {
                    result = before;
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
                result = before;
                steps.push({
                    step: i + 1,
                    method: method.toUpperCase() + ' (SKIPPED)',
                    input: before,
                    output: before + ' (method skipped - invalid format for this method)'
                });
            }
        }
        
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

document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(120, this.scrollHeight) + 'px';
    });
});
