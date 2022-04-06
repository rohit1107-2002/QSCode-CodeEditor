import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Client from '../components/Client';
import Editor from '../components/Editor';
import toast from 'react-hot-toast';

import { io } from 'socket.io-client';
const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
}; 

const EditorPage = () => {

    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit('join', { roomId, username: location.state?.username });

            // Listening for joined event
            socketRef.current.on('joined', ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit('sync-code', {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on('disconnected', ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {     // cleaning functions to clear the listeners
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard.');
        } catch (err) {
            toast.error('Could not copy the Room ID.');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        reactNavigator('/');
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-editor.jpg" alt="logo"/>
                        <p className="QS">QS Code - Code Editor</p>
                    </div>
                    
                    <h3 className='Text'>Active Members :</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>

                <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>

            </div>

            <div className="editorWrap">
                <Editor 
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    )
}

export default EditorPage