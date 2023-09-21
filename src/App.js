import React, { useEffect, useRef } from 'react';
import Peer from 'peerjs';

function App() {
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peer = new Peer(undefined, {
    host: '/',
    port: 443, // Sunucu portu
    secure: true,
  }); // Peer sunucusu bağlantısı (kendi sunucunuzu yapılandırmalısınız)

  useEffect(() => {
    const initializeVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        myVideoRef.current.srcObject = stream;

        peer.on('open', (id) => {
          // Diğer kullanıcıları dinle
          peer.on('call', (call) => {
            call.answer(stream); // Gelen çağrıyı yanıtla
            call.on('stream', (remoteStream) => {
              // Diğer kullanıcının video akışını görüntüle
              remoteVideoRef.current.srcObject = remoteStream;
            });
          });
        });

      } catch (error) {
        console.error('Hata:', error);
      }
    };

    initializeVideoChat();
  }, []);

  return (
    <div>
      <h1>Video Sohbet Uygulaması</h1>
      <div className="video-container">
        <video ref={myVideoRef} autoPlay muted style={{ width: 400 }}></video>
        <video ref={remoteVideoRef} autoPlay style={{ width: 400 }}></video>
      </div>
    </div>
  );
}

export default App;
