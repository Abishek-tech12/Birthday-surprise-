document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const thankYouMusic = document.getElementById('thank-you-music'); // Get the audio element

    // Define all message lines in order
    const messageLines = [
        { elementId: 'message-text-1', text: 'Thank you for taking the time to see this small gift from me.' },
        { elementId: 'message-text-2', text: 'Wishing you a very Happy Birthday filled with joy, laughter, and unforgettable moments.' },
        { elementId: 'message-text-3', text: 'May your day be as wonderful as you are, with lots of fun, happiness, and a lovely smile that never fades from your face!' }
    ];

    let currentLineIndex = 0;
    let currentTextElement = null;
    let currentCursorElement = null;

    // Typewriter effect for a single line
    function typeSingleLine(index, callback) {
        if (index >= messageLines.length) {
            // All lines typed, ensure last cursor is hidden
            if (currentCursorElement) {
                currentCursorElement.style.opacity = '0';
            }
            if (callback) callback(); // All lines typed
            return;
        }

        const lineData = messageLines[index];
        currentTextElement = document.getElementById(lineData.elementId);
        currentCursorElement = currentTextElement.nextElementSibling; // Get the cursor span next to the text span

        if (!currentTextElement || !currentCursorElement) {
            console.error(`Elements for line ${index + 1} not found.`);
            if (callback) callback();
            return;
        }

        // Make sure previous cursor (if any) is hidden
        if (index > 0) {
            const prevCursor = document.getElementById(messageLines[index - 1].elementId).nextElementSibling;
            if (prevCursor) {
                prevCursor.style.opacity = '0';
            }
        }

        currentTextElement.textContent = ''; // Clear content before typing
        currentCursorElement.style.opacity = '1'; // Show cursor

        let i = 0;
        const speed = 70; // Typing speed (milliseconds per character)

        const typingInterval = setInterval(() => {
            if (i < lineData.text.length) {
                currentTextElement.textContent += lineData.text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                currentLineIndex++;
                setTimeout(() => typeSingleLine(currentLineIndex, callback), 800); // Delay before next line
            }
        }, speed);
    }

    // Chocolate Shower
    function createChocolate() {
        const chocolate = document.createElement('div');
        chocolate.className = 'chocolate';
        chocolate.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        chocolate.style.animationDuration = `${Math.random() * 3 + 4}s`; // 4-7 seconds fall time
        chocolate.style.animationDelay = `${Math.random() * 0.5}s`; // Staggered start
        body.appendChild(chocolate);
        chocolate.addEventListener('animationend', () => {
            chocolate.remove(); // Remove element after animation to save memory
        });
    }

    // Star Sprinkling
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '✨'; // Star emoji
        star.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        star.style.top = `${Math.random() * 100}vh`; // Random vertical position
        star.style.animationDuration = `${Math.random() * 2 + 2}s`; // 2-4 seconds animation time
        star.style.animationDelay = `${Math.random() * 1}s`; // Staggered start
        body.appendChild(star);
        star.addEventListener('animationend', () => {
            star.remove(); // Remove element after animation
        });
    }

    // --- Page Initialization Logic ---

    // 1. Initially hide all cursors until their line starts typing
    document.querySelectorAll('.thank-you-cursor').forEach(cursor => {
        cursor.style.opacity = '0';
        cursor.style.display = 'inline-block'; // Ensure it takes space
    });

    // 2. Play music immediately (handling autoplay policies)
    thankYouMusic.play().catch(() => {
        const resumeMusic = () => {
            thankYouMusic.play();
            // Remove listeners once played to avoid multiple attempts
            document.removeEventListener('click', resumeMusic);
            document.removeEventListener('keydown', resumeMusic);
            document.removeEventListener('touchstart', resumeMusic);
        };
        document.addEventListener('click', resumeMusic, { once: true });
        document.addEventListener('keydown', resumeMusic, { once: true });
        document.addEventListener('touchstart', resumeMusic, { once: true }); // For mobile
    });

    // 3. Start typing effect after a small delay to allow music to attempt playing
    setTimeout(() => {
        typeSingleLine(0, () => {
            // This callback runs AFTER all lines are typed
            // Start continuous animations
            setInterval(createChocolate, 300);
            setInterval(createStar, 200);

            // Ensure the very last cursor is hidden after everything is done
            const allCursors = document.querySelectorAll('.thank-you-cursor');
            if (allCursors.length > 0) {
                allCursors[allCursors.length - 1].style.display = 'none';
            }
        });
    }, 500); // Small delay before typing starts
});
