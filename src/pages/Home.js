import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';


const Home = () => {
 
    const [roomId,setRoomId]=useState('');
    const [username,setusername]=useState('');
    const reactNavigator=useNavigate();

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidv4();
        console.log(id);
        setRoomId(id);
        toast.success('Created a new room.');
    }

    const handleInputEnter=(e)=>{
        if(e.code==='Enter')
        {
            joinRoom();
        }
    }

    const joinRoom=()=>{
        if(!roomId || !username)
        {
            toast.error('Room ID & Username is required.');
            return;
        }

        // Redirect
        reactNavigator(`/editor/${roomId}`,{ state:{username} });
    }

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src="code-editor.jpg" alt="code-sync-logo"/>
                <h4 className="intro">{'< '}Welcome to QS Code {'/>'} </h4>
                <h4 className="mainLabel">ENTER ROOM ID &#38; USERNAME</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e)=>setRoomId(e.target.value)}    // for writing room id manually by ownself
                        value={roomId}
                        onKeyUp={handleInputEnter}   // On pressing enter it submits/joins
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e)=>setusername(e.target.value)}    // for writing username manually by ownself
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                        Don't have a Room ID - Create &nbsp;
                        <a onClick={createNewRoom} href="" className="createNewBtn">New Room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4 className="foot">
                    Made with 💛&nbsp;by&nbsp;
                    <a href="https://linkedin.com/in/rohit-kumar-1107" target="_blank" >Rohit Kumar</a>
                </h4>            
            </footer>
        </div>
    )
}

export default Home