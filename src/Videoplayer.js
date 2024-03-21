import React, { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr'; 
import Hls from 'hls.js'; 

function VideoPlayer() {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        // const source = 'https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8';
        // const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
        const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
        const defaultOptions = {};

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(source);
            hls.on(Hls.Events.MANIFEST_PARSED, function (_event, _data) {
                const availableQualities = hls.levels.map((l) => l.height);
                // Add 'auto' option for resolution
                availableQualities.push('auto');
                defaultOptions.controls = [
                    'play-large',
                    'restart',
                    'rewind',
                    'play',
                    'fast-forward',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'captions',
                    'settings',
                    'pip',
                    'airplay',
                    'download',
                    'fullscreen',
                ];
                defaultOptions.quality = {
                    default: 'auto', // Set default quality to 'auto'
                    options: availableQualities,
                    forced: true,
                    onChange: (e) => updateQuality(e),
                };

                const player = new Plyr(videoElement, defaultOptions);
            });
            hls.attachMedia(videoElement);
            window.hls = hls;
        } else {
            const player = new Plyr(videoElement, defaultOptions);
        }

        return () => {
            // Clean up Plyr and Hls instances
            // This will be called when the component unmounts
            if (window.hls) {
                window.hls.destroy();
            }
        };
    }, []);

    function updateQuality(newQuality) {
        if (newQuality === 'auto') {
            // Set auto quality
            window.hls.levels.forEach((level, levelIndex) => {
                if (level.auto) {
                    window.hls.currentLevel = levelIndex;
                }
            });
        } else {
            window.hls.levels.forEach((level, levelIndex) => {
                if (level.height === newQuality) {
                    console.log( newQuality);
                    window.hls.currentLevel = levelIndex;
                }
            });
        }
    }

    return (
        <div style={{ margin:'80px', marginTop: '40px', height:'500px', marginLeft:'150px', marginRight:'150px',borderColor:'1px red', borderRadius:'50px'}}>
        <video className='video-player'
            ref={videoRef}
            preload="none"
            id="player"
            autoPlay
            controls
            crossOrigin="true"
        ></video>
        </div>
    );
}

export default VideoPlayer;
