import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

function VoiceCall({ socket, username }) {
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [micMuted, setMicMuted] = useState(false);

  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    // Обработка входящих вызовов
    socket.on("incoming call", ({ from }) => {
      setIncomingCall(from);
    });

    socket.on("call accepted", () => {
      setIsInCall(true);
      setIsCalling(false);
    });

    socket.on("call ended", () => {
      endCall();
    });

    socket.on("offer", async (offer) => {
      if (!peerConnection.current) {
        peerConnection.current = new RTCPeerConnection();
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("candidate", event.candidate);
          }
        };

        peerConnection.current.ontrack = (event) => {
          // Здесь вы можете обработать поток удалённого пользователя, если потребуется
        };
      }
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("candidate", async (candidate) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("incoming call");
      socket.off("call accepted");
      socket.off("call ended");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [socket]);

  // Начало вызова
  const startCall = async (user) => {
    setIsCalling(true);
    socket.emit("call", { from: username, to: user });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", event.candidate);
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", offer);
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
      setIsCalling(false);
    }
  };

  // Принятие вызова
  const acceptCall = async () => {
    setIsInCall(true);
    setIncomingCall(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", event.candidate);
        }
      };

      socket.emit("accept call", username);
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
    }
  };

  // Отклонение вызова
  const declineCall = () => {
    setIncomingCall(null);
  };

  // Завершение звонка
  const endCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    socket.emit("end call");
    setIsCalling(false);
    setIsInCall(false);
    setIncomingCall(null);
  };

  // Включение / выключение микрофона
  const toggleMic = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setMicMuted(!micMuted);
    }
  };

  return (
    <div className="voice-call">
      {!isInCall && !incomingCall && !isCalling && <p>Голосовой чат доступен</p>}

      {isCalling && <p>Звонок...</p>}

      {incomingCall && (
        <div>
          <p>Входящий вызов от {incomingCall}...</p>
          <button className="btn btn-success" onClick={acceptCall}>
            Принять
          </button>
          <button className="btn btn-danger" onClick={declineCall}>
            Отклонить
          </button>
        </div>
      )}

      {isInCall && (
        <div>
          <p>Разговор идёт</p>
          <button className="btn btn-warning" onClick={toggleMic}>
            {micMuted ? "🔇 Включить микрофон" : "🎤 Выключить микрофон"}
          </button>
          <button className="btn btn-danger" onClick={endCall}>
            Завершить вызов
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceCall;
