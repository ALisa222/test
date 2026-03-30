const CHAR_SETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const passwordOutput = document.getElementById('password-output');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');

const checkboxes = {
    lowercase: document.getElementById('lowercase'),
    uppercase: document.getElementById('uppercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols')
};

lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

function getActiveCharSets() {
    return Object.entries(checkboxes)
        .filter(([_, checkbox]) => checkbox.checked)
        .map(([name]) => name);
}

function generatePassword(length, activeSets) {
    if (activeSets.length === 0) {
        return '';
    }

    let charset = '';
    activeSets.forEach(set => {
        charset += CHAR_SETS[set];
    });

    let password = '';
    const requiredChars = activeSets.map(set => {
        const chars = CHAR_SETS[set];
        return chars[Math.floor(Math.random() * chars.length)];
    });

    for (let i = 0; i < requiredChars.length; i++) {
        password += requiredChars[i];
    }

    while (password.length < length) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return shuffleString(password);
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copyToClipboard() {
    if (!passwordOutput.value) return;
    
    navigator.clipboard.writeText(passwordOutput.value).then(() => {
        showToast();
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = passwordOutput.value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
    });
}

function generate() {
    const activeSets = getActiveCharSets();
    
    if (activeSets.length === 0) {
        passwordOutput.value = '';
        passwordOutput.placeholder = 'Выберите хотя бы один набор символов';
        return;
    }

    passwordOutput.placeholder = 'Нажмите \'Сгенерировать\'';
    const length = parseInt(lengthSlider.value);
    const password = generatePassword(length, activeSets);
    passwordOutput.value = password;
}

generateBtn.addEventListener('click', generate);
copyBtn.addEventListener('click', copyToClipboard);

generate();
