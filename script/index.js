// js/index.js - Scripting for the homepage typewriter effect

document.addEventListener('DOMContentLoaded', () => {
    const greetings = ["Hello", "Bonjour", "Aloha", "你好", "こんにちは"];
    const typewriterElement = document.getElementById('typewriter');
    const cursorElement = document.querySelector('.type-cursor');
    
    // Ensure elements exist before proceeding
    if (!typewriterElement || !cursorElement) {
        console.error("Typewriter or cursor element not found.");
        return;
    }

    let greetIndex = 0;  // Current index in the greetings array
    let charIndex = 0;   // Current character index in the current greeting
    let isTyping = true; // True if typing, false if deleting

    /**
     * Main loop for the typewriter effect.
     * Types out a greeting, then deletes it, then moves to the next greeting.
     */
    function typeLoop() {
        const currentGreeting = greetings[greetIndex];
        if (isTyping) {
            // Typing phase: add characters one by one
            if (charIndex < currentGreeting.length) {
                typewriterElement.textContent = currentGreeting.slice(0, charIndex + 1);
                charIndex++;
                setTimeout(typeLoop, 200); // Speed of typing
            } else {
                // Finished typing this greeting, switch to deleting phase
                isTyping = false;
                setTimeout(typeLoop, 1000); // Pause before deleting
            }
        } else {
            // Deleting phase: remove characters one by one
            if (charIndex > 0) {
                typewriterElement.textContent = currentGreeting.slice(0, charIndex - 1);
                charIndex--;
                setTimeout(typeLoop, 100); // Speed of deleting
            } else {
                // Finished deleting, switch to typing phase for the next greeting
                isTyping = true;
                greetIndex = (greetIndex + 1) % greetings.length; // Cycle through greetings
                setTimeout(typeLoop, 1000); // Pause before typing next greeting
            }
        }
    }

    // Start the typewriter effect
    typeLoop();

    // Cursor blinking effect
    setInterval(() => {
        cursorElement.style.opacity = cursorElement.style.opacity === '0' ? '1' : '0';
    }, 500); // Blinking interval
}); 