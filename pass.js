// === 1. CONECTAR CON LA PÁGINA (buscar todos los elementos) ===

// El cuadro donde se muestra la contraseña
const passwordOutput = document.getElementById('passwordOutput');

// El control deslizante y el número que muestra la longitud
const lengthSlider = document.getElementById('length');
const lengthSpan = document.getElementById('lengthValue');

// Los checkboxes de opciones
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');

// Los botones
const generateBtn = document.getElementById('generateButton');
const copyBtn = document.getElementById('copyButton');

// El indicador de fortaleza
const strengthIndicator = document.getElementById('strengthIndicator');

// === 2. PREPARAR LOS CARACTERES DISPONIBLES ===

// Un "diccionario" con todos los tipos de caracteres
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+[]{}|;:,.<>?'
};

// === 3. FUNCIONES (las "recetas" que usaremos después) ===

// Función 1: Actualizar el número que muestra la longitud
lengthSlider.addEventListener('input', () => {
    lengthSpan.textContent = lengthSlider.value;
});

// Función 2: Ver qué opciones están marcadas
function getSelectedChars() {
    let chars = '';  // Empezamos con vacío
    
    // Si está marcado, añadimos esos caracteres
    if (uppercaseCheck.checked) chars += charSets.uppercase;
    if (lowercaseCheck.checked) chars += charSets.lowercase;
    if (numbersCheck.checked) chars += charSets.numbers;
    if (symbolsCheck.checked) chars += charSets.symbols;
    
    return chars;  // Devolvemos todos los caracteres disponibles
}

// Función 3: Generar la contraseña
function generatePassword() {
    // Cuántos caracteres debe tener
    const length = parseInt(lengthSlider.value);
    
    // Qué caracteres podemos usar
    let chars = getSelectedChars();
    
    // Si no se marcó nada, usamos minúsculas
    if (chars === '') {
        chars = charSets.lowercase;
        lowercaseCheck.checked = true;
    }
    
    // Creamos la contraseña vacía
    let password = '';
    
    // Repetimos tantas veces como la longitud elegida
    for (let i = 0; i < length; i++) {
        // Elegimos un número al azar entre 0 y el total de caracteres
        const randomIndex = Math.floor(Math.random() * chars.length);
        // Añadimos el caracter que está en esa posición
        password += chars[randomIndex];
    }
    
    return password;  // Devolvemos la contraseña lista
}

// Función 4: Evaluar qué tan fuerte es la contraseña
function evaluateStrength(password) {
    let score = 0;  // Empezamos con 0 puntos
    
    // Puntos por longitud
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Puntos por tener diferentes tipos de caracteres
    if (/[A-Z]/.test(password)) score++;  // Tiene mayúsculas
    if (/[a-z]/.test(password)) score++;  // Tiene minúsculas
    if (/[0-9]/.test(password)) score++;  // Tiene números
    if (/[^A-Za-z0-9]/.test(password)) score++;  // Tiene símbolos
    
    // Decidimos el resultado según los puntos
    if (score <= 2) return 'Débil';
    if (score <= 4) return 'Media';
    return 'Fuerte';
}

// === 4. ACCIONES (lo que pasa cuando hacemos clic) ===

// Acción 1: Cuando hacemos clic en "Generar Contraseña"
generateBtn.addEventListener('click', () => {
    // Generamos una nueva contraseña
    const newPassword = generatePassword();
    
    // La mostramos en el cuadro de texto
    passwordOutput.value = newPassword;
    
    // Evaluamos su fortaleza
    const strength = evaluateStrength(newPassword);
    
    // Mostramos la fortaleza
    strengthIndicator.textContent = strength;
    
    // Le damos color según la fortaleza
    if (strength === 'Débil') {
        strengthIndicator.style.color = '#e74c3c';  // Rojo
    } else if (strength === 'Media') {
        strengthIndicator.style.color = '#f39c12';  // Naranja
    } else {
        strengthIndicator.style.color = '#2ecc71';  // Verde
    }
});

// Acción 2: Cuando hacemos clic en el botón de copiar
copyBtn.addEventListener('click', async () => {
    // Si no hay contraseña, avisamos
    if (!passwordOutput.value) {
        alert('Primero genera una contraseña');
        return;
    }
    
    // Intentamos copiar
    try {
        // Copiamos al portapapeles
        await navigator.clipboard.writeText(passwordOutput.value);
        
        // Cambiamos el botón temporalmente
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';  // Palomita verde
        
        // Después de 1.5 segundos, volvemos al icono original
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
        
    } catch (err) {
        // Si hay error, avisamos
        alert('No se pudo copiar');
    }
});

// === 5. INICIO (lo que pasa cuando carga la página) ===

// Cuando la página termine de cargar, generamos una contraseña de ejemplo
window.addEventListener('load', () => {
    generateBtn.click();
});