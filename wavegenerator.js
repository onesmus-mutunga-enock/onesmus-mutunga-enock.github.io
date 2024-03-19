window.onload = function() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = document.getElementById('audio');
    const audioSource = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    const canvas = document.getElementById('waveform');
    const canvasCtx = canvas.getContext('2d');
    
    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);
    
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    function draw() {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = 'rgb(255, 0, 0)';

        canvasCtx.beginPath();

        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            let y = v * HEIGHT / 2;
        
            if (i % 2 === 0) {
                y += 1; // Increase y position for upcline effect
            } else {
                y -= 1; // Decrease y position for anticline effect
            }
        
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        
            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    draw();
};

{/* <canvas id="waveform" width="800" height="200"></canvas> */}
    // <audio id="audio" src="your-audio-file.mp3" controls></audio>