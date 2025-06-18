(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const inputText = document.getElementById('input-text');
        const outputText = document.getElementById('output-text');
        const encryptBtn = document.querySelector('.encrypt-btn');
        const decryptBtn = document.querySelector('.decrypt-btn');
        const clearBtn = document.querySelector('.clear-btn');
        const copyBtn = document.querySelector('.copy-btn');
        const toggleStepsBtn = document.querySelector('.toggle-steps-btn');
        const stepsContent = document.getElementById('steps-content');
        const selectAllBtn = document.querySelector('.select-all-btn');
        const clearAllBtn = document.querySelector('.clear-all-btn');
        const toggleExtraMethodsBtn = document.getElementById('toggle-extra-methods');
        const extraMethodsSection = document.getElementById('extra-methods-section');
        const notificationArea = document.getElementById('notification-area');

        const EncryptionMethods = {
            rot13: {
                encrypt: (text) => text.replace(/[a-zA-Z]/g, char => {
                    const start = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
                }),
                decrypt: (text) => EncryptionMethods.rot13.encrypt(text)
            },
            atbash: {
                encrypt: (text) => text.split('').map(char => {
                    if (/[a-zA-Z]/.test(char)) {
                        const start = char <= 'Z' ? 65 : 97;
                        return String.fromCharCode((25 - (char.charCodeAt(0) - start)) + start);
                    }
                    return char;
                }).join(''),
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
                }
            },
            reverse: {
                encrypt: (text) => text.split('').reverse().join(''),
                decrypt: (text) => text.split('').reverse().join('')
            },
            morse: {
                encrypt: (text) => {
                    const morseMap = {
                        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..--',
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
                        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..--': '2',
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
                }
            },
            binary: {
                encrypt: (text) => text.split('').map(char =>
                    char.charCodeAt(0).toString(2).padStart(8, '0')
                ).join(' '),
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
                }
            },
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
                encrypt: (text) => text.split('').map(char =>
                    char.charCodeAt(0).toString(16).padStart(2, '0')
                ).join(''),
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

        function showNotification(message, isError = false) {
            const notification = document.createElement('div');
            notification.className = `notification ${isError ? 'error' : ''}`;
            notification.textContent = message;
            notificationArea.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }

        function getSelectedMethods() {
            const methods = [];
            document.querySelectorAll('.method-checkbox:checked').forEach(checkbox => {
                methods.push(checkbox.dataset.method);
            });
            return methods;
        }

        function process(action) {
            const text = inputText.value;
            if (!text.trim()) {
                showNotification(`Please enter a message to ${action}!`, true);
                return;
            }

            const selectedMethods = getSelectedMethods();
            if (selectedMethods.length === 0) {
                showNotification('Please select at least one encryption method!', true);
                return;
            }

            outputText.classList.add('processing');
            let result = text;
            const steps = [];

            try {
                if (action === 'encrypt') {
                    selectedMethods.forEach((method, index) => {
                        const before = result;
                        result = EncryptionMethods[method].encrypt(result);
                        steps.push({ step: index + 1, method: method.toUpperCase(), input: before, output: result });
                    });
                } else {
                    const reverseOrder = [...selectedMethods].reverse();
                    const decryptionResult = attemptDecryptionWithOrder(text, reverseOrder);
                    if (decryptionResult.success) {
                        result = decryptionResult.text;
                        steps.push(...decryptionResult.steps);
                    } else {
                        throw new Error('Decryption failed with reversed order, trying normal order.');
                    }
                }

                outputText.value = result;
                displaySteps(steps, action.charAt(0).toUpperCase() + action.slice(1));
                copyBtn.classList.add('show');

            } catch (error) {
                showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} failed: ${error.message}`, true);
            } finally {
                outputText.classList.remove('processing');
            }
        }

        function attemptDecryptionWithOrder(text, methodOrder) {
            let result = text;
            const steps = [];
            let success = true;

            for (let i = 0; i < methodOrder.length; i++) {
                const method = methodOrder[i];
                const before = result;
                try {
                    result = EncryptionMethods[method].decrypt(result);
                    if (!result && before) {
                        result = before;
                        steps.push({ step: i + 1, method: method.toUpperCase() + ' (SKIPPED)', input: before, output: before + ' (method skipped due to empty result)' });
                    } else {
                        steps.push({ step: i + 1, method: method.toUpperCase(), input: before, output: result });
                    }
                } catch (e) {
                    result = before;
                    steps.push({ step: i + 1, method: method.toUpperCase() + ' (SKIPPED)', input: before, output: before + ' (method skipped - invalid format)' });
                }
            }
            return { success, text: result, steps };
        }

        function displaySteps(steps, type) {
            stepsContent.innerHTML = '';
            stepsContent.className = 'steps-content-collapsed';
            toggleStepsBtn.textContent = '🔍 Show Steps';
            toggleStepsBtn.classList.add('show');

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
            if (stepsContent.className === 'steps-content-collapsed') {
                stepsContent.className = 'steps-content-expanded';
                toggleStepsBtn.textContent = '🔍 Hide Steps';
            } else {
                stepsContent.className = 'steps-content-collapsed';
                toggleStepsBtn.textContent = '🔍 Show Steps';
            }
        }

        function truncateText(text, maxLength) {
            if (typeof text !== 'string') return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }

        function selectAllMethods(state) {
            document.querySelectorAll('.method-checkbox').forEach(checkbox => {
                checkbox.checked = state;
            });
        }

        function clearAll() {
            inputText.value = '';
            outputText.value = '';
            toggleStepsBtn.classList.remove('show');
            copyBtn.classList.remove('show');
            stepsContent.className = 'steps-content-collapsed';
        }

        async function copyToClipboard() {
            if (!outputText.value) {
                showNotification('Nothing to copy!', true);
                return;
            }
            try {
                await navigator.clipboard.writeText(outputText.value);
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                showNotification('Failed to copy text.', true);
            }
        }

        function toggleExtraMethods(event) {
            const isHidden = extraMethodsSection.style.display === 'none' || extraMethodsSection.style.display === '';
            extraMethodsSection.style.display = isHidden ? 'block' : 'none';
            toggleExtraMethodsBtn.textContent = isHidden ? 'Hide extra annoying methods' : 'Show extra annoying methods';
        }

        encryptBtn.addEventListener('click', () => process('encrypt'));
        decryptBtn.addEventListener('click', () => process('decrypt'));
        clearBtn.addEventListener('click', clearAll);
        copyBtn.addEventListener('click', copyToClipboard);
        toggleStepsBtn.addEventListener('click', toggleSteps);
        selectAllBtn.addEventListener('click', () => selectAllMethods(true));
        clearAllBtn.addEventListener('click', () => selectAllMethods(false));
        toggleExtraMethodsBtn.addEventListener('click', toggleExtraMethods);

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.max(120, this.scrollHeight) + 'px';
            });
        });
    });
})();
