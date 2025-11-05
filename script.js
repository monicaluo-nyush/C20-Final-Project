document.addEventListener("DOMContentLoaded", function () {
    // ===== Elements =====
    const startBtn = document.getElementById('start-button');
    const startPage = document.getElementById('start-page');
    const essayPage = document.getElementById('essay-page');
    const audioElement = document.getElementById('background-music');

    // ===== Music Tracks =====
    const musicTracks = {
        section2: { file: 'Cowherd Flute.mp3', startTime: 0 },
        section3: { file: 'White Hair Girl.mp3', startTime: 300 },
        section4: { file: 'Butterfly Lovers.mp3', startTime: 30 },
        section5: { file: 'Dream.mp3', startTime: 0 },
        section6: { file: 'Peking Fantasy.mp3', startTime: 163 },
        section7: { file: 'Gong Viola.mp3', startTime: 735 }
    };

    let currentTrack = '';
    let currentSection = '';
    const playbackPositions = {};

    // ===== Initialize start page music =====
    const startPageMusic = 'Tan Dun.mp3';
    audioElement.src = startPageMusic;
    audioElement.loop = true;
    audioElement.volume = 0.5;
    audioElement.play().catch(err => console.log("Audio playback error:", err));

    // ===== Start button =====
    startBtn.addEventListener('click', () => {
        startPage.style.display = 'none';
        essayPage.style.display = 'block';

        if (audioElement.paused) {
            audioElement.play().catch(err => console.log("Audio playback error:", err));
        }
    });

    // ===== Fade In/Out Functions =====
    function fadeOut(audio, duration = 1000, callback = () => {}) {
        const step = 0.05;
        const interval = duration * step;
        const fade = setInterval(() => {
            if (audio.volume > step) {
                audio.volume -= step;
            } else {
                audio.volume = 0;
                clearInterval(fade);
                callback();
            }
        }, interval);
    }

    function fadeIn(audio, duration = 1000) {
        const step = 0.05;
        const interval = duration * step;
        const fade = setInterval(() => {
            if (audio.volume < 1 - step) {
                audio.volume += step;
            } else {
                audio.volume = 1;
                clearInterval(fade);
            }
        }, interval);
    }

    // ===== Section Music Logic =====
    const sections = Array.from(document.querySelectorAll('.section'));

    function getCurrentSection() {
        let closest = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (rect.top < window.innerHeight && distance < minDistance) {
                closest = section;
                minDistance = distance;
            }
        });

        return closest ? closest.id : null;
    }

    function checkAndPlayMusic() {
        const newSection = getCurrentSection();
        if (!newSection || newSection === currentSection) return;

        const trackInfo = musicTracks[newSection];
        if (!trackInfo) return;

        currentSection = newSection;

        if (currentTrack) {
            playbackPositions[currentTrack] = audioElement.currentTime;
            console.log(`Saved ${currentTrack} at ${audioElement.currentTime}s`);
        }

        if (currentTrack !== trackInfo.file) {
            fadeOut(audioElement, 1000, () => {
                audioElement.pause();
                audioElement.src = trackInfo.file;
                const resumeTime = playbackPositions[trackInfo.file] ?? trackInfo.startTime;
                audioElement.currentTime = resumeTime;
                audioElement.volume = 0;
                audioElement.play().then(() => {
                    currentTrack = trackInfo.file;
                    fadeIn(audioElement, 1000);
                    console.log(`Now playing ${currentTrack} from ${resumeTime}s`);
                }).catch(err => console.log("Audio play error:", err));
            });
        }
    }

    // ===== Event Listeners for Music =====
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(checkAndPlayMusic);
    });
    window.addEventListener('load', checkAndPlayMusic);

    // ===== Italicize Specific Phrases =====
    function italicizePhrases() {
        const phrasesToItalicize = [
            "White Hair Girl",
            "Peking Fantasy",
            "Dream of the Red Chambers",
            "Dream of the Red Chamber",
            "Butterfly Lovers Violin Concerto",
            "Cowherd's Flute",
            "Red Detatechment of Women",
            "Rhapsody in Red : How Western Classical Music Became Chinese",
            "Dream of the Red Mansion",
            "Story of the Ston"
        ];

        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');

        elements.forEach(el => {
            phrasesToItalicize.forEach(phrase => {
                const regex = new RegExp(`\\b(${phrase})\\b`, 'g');
                if (regex.test(el.innerHTML)) {
                    el.innerHTML = el.innerHTML.replace(regex, '<em>$1</em>');
                }
            });
        });
    }

    // ===== Photo Comparison Slider =====
    function initPhotoComparison() {
        const slider = document.querySelector('.comparison-slider');
        const oldPhoto = document.querySelector('.old-photo');
        const newPhoto = document.querySelector('.new-photo');
        const sliderHandle = document.querySelector('.slider-handle');
        
        if (!slider || !oldPhoto || !newPhoto || !sliderHandle) return;
        
        function updateComparison() {
            const value = slider.value;
            
            // Update clip paths - at 75%, shows left 75% of old photo and right 25% of new photo
            oldPhoto.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            newPhoto.style.clipPath = `inset(0 0 0 ${value}%)`;
            
            // Update slider handle position
            sliderHandle.style.left = `${value}%`;
        }
        
        // Initialize the comparison with default value (75%)
        updateComparison();
        
        // Add event listener for slider input
        slider.addEventListener('input', updateComparison);
        
        // Add touch support for mobile devices
        slider.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        
        slider.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const rect = slider.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            slider.value = percentage;
            updateComparison();
        });
    }

    // ===== Initialize All Functions =====
    italicizePhrases();
    initPhotoComparison();
});
