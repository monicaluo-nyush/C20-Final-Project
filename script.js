document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById('start-button');
    const startPage = document.getElementById('start-page');
    const essayPage = document.getElementById('essay-page');
    const audioElement = document.getElementById('background-music');

    const musicTracks = {
        section2: { file: 'Cowherd Flute.mp3', startTime: 0 },
        section3: { file: 'White Hair Girl.mp3', startTime: 0 },
        section4: { file: 'Butterfly Lovers.mp3', startTime: 0 },
        section5: { file: 'Dream.mp3', startTime: 0 },
        section6: { file: 'Peking Fantasy.mp3', startTime: 0 },
        section7: { file: 'Gong Viola.mp3', startTime: 0 },
    };
    

    let currentTrack = '';
    let currentSection = '';
    const playbackPositions = {};

    // Initialize background music for start page
    const startPageMusic = 'Tan Dun.mp3';
    audioElement.src = startPageMusic;
    audioElement.loop = true;
    audioElement.volume = 0.5;
    audioElement.play().catch(err => console.log("Audio playback error:", err));

    // Start button listener
    startBtn.addEventListener('click', () => {
        startPage.style.display = 'none';
        essayPage.style.display = 'block';

        if (audioElement.paused) {
            audioElement.play().catch(err => console.log("Audio playback error:", err));
        }
    });

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

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(checkAndPlayMusic);
    });

    window.addEventListener('load', checkAndPlayMusic);

    //  Italicize specific phrases in paragraphs and headings
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

    italicizePhrases(); 
});
