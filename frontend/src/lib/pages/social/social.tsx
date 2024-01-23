import { useEffect, useState} from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { Message } from './message.model';
//import { Channel } from './channel.model';
import { Button } from "@/lib/components/ui/button";
import { TextField, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
//import { AddFriends } from '@/lib/components/ui/AddFriends'
//import { UserNav } from '@/lib/components/ui/user-nav';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "../../styles/social.css"
//import io from 'socket.io-client';

//const socket = io('http://127.0.0.1:3001');

const social = () => {
	type ChatMessage = {
		senderPseudo: string;
		content: string;
		createdAt: string; // assuming createdAt is a string that needs to be converted to a Date
		// add any other properties that are included in your message objects
	  };
	const [inputMessage, setInputMessage] = useState('');
    const [chatContext, setChatContext] = useState<{ id: number, userIds: number }>({ id: 0, userIds: 0 });
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [blockInput, setBlockInput] = useState(''); // Valeur de l'entrée de texte pour bloquer
    const [addInput, setaddInput] = useState(''); // Valeur de l'entrée de texte pour add
    const [ChannelName, setChannelName] = useState(''); // Valeur de l'entrée de texte pour cree channel
    const [passwordInput, setPasswordInput] = useState('');
    const [joinChannel, setJoinChannel] = useState('');
    const [channelVisibility, setChannelVisibility] = useState('public');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column', // Utilisez 'row' pour un alignement horizontal
        alignItems: 'center',    // Centre horizontalement dans un conteneur 'flex'
        justifyContent: 'center'
      };

      useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData); 
        };
        fetchData();
      });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

   const handleadd = async () => {
        try {
          const response = await fetch('http://127.0.0.1:3001/users/FriendRequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ addFriend: addInput, userId: user[0].id }),
          });
    
          if (!response.ok) {
            throw new Error('La réponse du réseau n’était pas correcte');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du pseudo :', error);
        }
        setaddInput('');
      };

    const handleBlock  = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/users/Block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ blockpseudo: blockInput, userId: user[0].id }),
            });
            if (!response.ok) {
                throw new Error('La réponse du réseau n’était pas correcte');
            }
        } catch (error) {
            console.error('Erreur lors du blockage :', error);
        }
        if (currentView === 'Blocked'){
            getBlock();
        }
        setBlockInput('');
    };

     const handleAccept = async (friend: string) => {
         try {
             const response = await fetch('http://127.0.0.1:3001/users/AcceptFriend', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 credentials: 'include', // Inclure les cookies avec la requête
                 body: JSON.stringify({ friendPseudo: friend, userId: user[0].id }),
             });
             if (!response.ok) {
                 throw new Error('La réponse du réseau n’était pas correcte');
             }
         } catch (error) {
             console.error('Erreur lors de l\'ajout du friend :', error);
        }
        getNotifications();
    }
    
     const handleDecline = async (friend: string) => {
         try {
             const response = await fetch('http://127.0.0.1:3001/users/RefuseFriend', {
                 method: 'POST',
                 headers: {
                    'Content-Type': 'application/json',
                 },
                 credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ friendPseudo: friend, userId: user[0].id }),
             });
             if (!response.ok) {
                 throw new Error('La réponse du réseau n’était pas correcte');
             }
         } catch (error) {
             console.error('Erreur lors de l\'ajout du friend :', error);
         }
        getNotifications();
    }

    const getFriends  = async () => {
        setCurrentView('Friends');
        const userData = await fetchUserDetails();
        try {
            const List = []; // Créez une nouvelle liste pour les amis
            for (let i = 0; i < userData[0].friends.length; i++) {
                const friendId = userData[0].friends[i];
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
            setLists([...List]);
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    };

    const getChannel = async () => {
        setCurrentView('Channel');
        const userData = await fetchUserDetails();
        console.log(userData[0].channels);
        const List = [];
        for (let i = 0; i < userData[0].channels.length; i++) {
            const channelId = userData[0].channels[i];
            const response = await fetch(`http://127.0.0.1:3001/channels/channelNameById/${channelId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                }
            setLists([...List]);
        }
    }

    const getBlock  = async () => {
        setCurrentView('Blocked');
        const userData = await fetchUserDetails();
        try {
            const List = []; // Créez une nouvelle liste pour les amis
            for (let i = 0; i < userData[0].banlist.length; i++) {
                const friendId = userData[0].banlist[i];
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
            setLists([...List]);
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    };

    const getNotifications = async () => {
        setCurrentView('Notifications');
        const userData = await fetchUserDetails();
        try {
            const friendsList = []; // Créez une nouvelle liste pour les amis
    
            for (let i = 0; i < userData[0].friendNotif.length; i++) {
                const friendId = userData[0].friendNotif[i];
                console.log(user[0].friendNotif[i]);
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.text();
                    friendsList.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
            setLists([...friendsList]);
        } catch (error) {
            console.error('Error during get notifs:', error);
        }
    };

    const handleUnblock  = async (unblockPseudo: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/users/social/unblock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ unblockpseudo: unblockPseudo, userId: user[0].id }),
            });
            if (!response.ok) {
                throw new Error('La réponse du réseau n’était pas correcte');
            }
        } catch (error) {
            console.error('Erreur lors du blockage :', error);
        }
        getBlock();
    };

    const handleCreateChannel = async () => {
        try {
          const channelData = {
            name: ChannelName, // From your state
            password: passwordInput, // From your state, could be empty if not private
            visibility: channelVisibility, // From your state
            admin: user[0].id,
            owner: user[0].id,
            memberIds: user[0].id // The current user's ID
          };
          if (!ChannelName){
            console.log("need a name for the channel");
            return ;
          }
          const response = await fetch('http://127.0.0.1:3001/channels/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // if you're including credentials like cookies
            body: JSON.stringify(channelData),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error while creating channel:', errorData.error);
            if (response.status === 409) {
                console.log("channel name already taken");
                return;
              }
          }
          const newChannel = await response.json();
          const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // if you're including credentials like cookies
            body: JSON.stringify({ channelId: newChannel.id, userId: user[0].id }),
          });
          if (!responsetwo.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error during channel creation:', error);
        }
        setChannelName('');
        setPasswordInput('');
        if (currentView === 'Channel') {
            getChannel();
        }
      };

    const handleJoinChannel  = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/channels/findChannelByName/${ChannelName}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            });
            if (response.ok){
                const responseData = await response.json();
                if (responseData.password) {
                    if (!passwordInput || (passwordInput !== responseData.password)){
                        console.log("wrong password or password missing1")
                        return;
                    }
                const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include', // if you're including credentials like cookies
                body: JSON.stringify({ channelId: responseData.id, userId: user[0].id }),
                });
                if (!responsetwo.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const responsethree = await fetch(`http://127.0.0.1:3001/channels/addUserId/${user[0].id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include', // if you're including credentials like cookies
                body: JSON.stringify({ channelName: responseData.name }),
                });
                if (!responsethree.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                }
                else {
                    if (passwordInput){
                        console.log("wrong password or password missing");
                        return ;
                    }
                    else {
                        const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        credentials: 'include', // if you're including credentials like cookies
                        body: JSON.stringify({ channelId: responseData.id, userId: user[0].id }),
                        });
                        if (!responsetwo.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }
                        try {
                            const responsefor = await fetch(`http://127.0.0.1:3001/channels/addUserId/${user[0].id}`, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({ channelName: responseData.name }),
                            });
                            if (!responsefor.ok) {
                            throw new Error(`Network response was not ok: ${responsefor.statusText}`);
                            }
                                // ... autres traitements ...
                        }catch (error) {
                            console.log("Caught an error:", error);
                        }  
                    }
                }
            }
            else {
                console.log('unable to find channel:', ChannelName);
                return;
            }
        } catch (error) {
            console.log('Error during join channel:', error);
        }
        setPasswordInput('');
        setChannelName('');
        if (currentView === 'Channel') {
            getChannel();
        }
    };

    const handleUnfriend  = async (friendname: string) => {
        try {
            const response = await fetch('http://127.0.0.1:3001/users/Unfriend', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // if you're including credentials like cookies
                body: JSON.stringify({ friendName: friendname, userId: user[0].id }),
              });
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        }
        catch (error) {
            console.log("unable to unfriend");
        }
        getFriends();
    };

    const fetchFriendChatHistory  = async (friendPseudo: string) =>  {
        try {
            const response = await fetch(`http://127.0.0.1:3001/users/getId/${friendPseudo}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            });
            if (response.ok) {
                const friendId = Number(await response.json());
                const userId = Number(user[0].id);
				setChatContext({ id: 0, userIds: friendId });
				const chatHistoryResponse = await fetch(`http://127.0.0.1:3001/chatHistory/history/${userId}/${friendId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});
				if (chatHistoryResponse.ok) {
					const chathistory = await chatHistoryResponse.json();
					const formattedChatHistory = chathistory.flatMap((chatData: any) => {     
                        // Convertit la chaîne JSON en tableau d'objets
                        const messagesArray = JSON.parse(chatData.messages);
                        // Mappe sur les messages pour formater les dates
                        const formattedMessages = messagesArray.map((message: ChatMessage) => {
                            message.createdAt = new Date(message.createdAt).toLocaleString();
                            return message;
                        });
                    
                        // Return the array of original messages
                        return formattedMessages;
                    });
					setChatHistory(formattedChatHistory);
				} else {
					// Handle errors in fetching chat history
					console.error('Error fetching chat history');
				}
			} else {
				// Handle errors in fetching friend's user ID
				console.error('Error fetching friend\'s user ID');
			}
		} catch (error) {
			console.error('Unable to fetch chat history', error);
		}
	};

	const sendMessage = async () => {
        if (inputMessage.trim() === '') return; // Prevent sending empty messages
		let messagedata;
        if (chatContext.id === 0) {
			// It's a private chat
			messagedata = {
				content: inputMessage,
				senderId: user[0].id, // Assuming user[0].id is the current user's id
				createdAt: new Date(),
				// For private chat, include both user IDs in the recipient field
				recipientId: chatContext.userIds // Array containing both user IDs
			};
		} else {
			// It's a channel chat
			messagedata = {
				content: inputMessage,
				senderId: user[0].id, // Assuming user[0].id is the current user's id
				createdAt: new Date(),
				// For channel chat, include the channel ID
				channelId: chatContext.id
			};
		}
        try {
            const response = await fetch('http://127.0.0.1:3001/chatHistory/newPrivateMessage', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // if you're including credentials like cookies
                body: JSON.stringify(messagedata)
              });
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const userId = Number(user[0].id);
            const responsetwo = await fetch (`http://127.0.0.1:3001/users/getSocket/${userId}`, {
                method: 'GET',
				headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});
				if (responsetwo.ok) {
                    const userSocket = await responsetwo.json();
                    console.log('socket in sendMessage = ', userSocket);
                    userSocket.emit('new_message', { 
                    chatType: chatContext.id === 0 ? 'private' : 'channel',
                    chatId: chatContext.id === 0 ? chatContext.userIds : chatContext.id
                    });
                }
            }
        catch (error) {
            console.log("unable to add message");
        }
        // Logic to send messageData to the backend
        setInputMessage(''); // Clear input field after sending
    };

    const handleLeave = async (channelName: string) => {
        channelName;
        //try {

        //}
        //supprimer userId in the channel MembersId //POST in channel
        //supprimer channelId in the user Channel //POST in user
        // if user is owner destroy channel //POST channel delete ?
    }
    
    return (
        <div className="main-container"> {/* Cadre principal (orange) */}
            <div className="functionality-container"> {/* Cadre fonctionnalités (rouge) */}
            <div className="button-group"> {/* Conteneur pour les boutons */}
                <Button variant="outline" className={currentView === 'Notifications' ? 'button-small button-small-selected' : 'button-small'} onClick={getNotifications}>Notifications</Button>
                <Button variant="outline" className={currentView === 'Friends' ? 'button-small button-small-selected' : 'button-small'} onClick={getFriends}>Friends</Button>
                <Button variant="outline" className={currentView === 'Blocked' ? 'button-small button-small-selected' : 'button-small'} onClick={getBlock}>Blocked</Button>
                <Button variant="outline" className={currentView === 'Channel' ? 'button-small button-small-selected' : 'button-small'} onClick={getChannel}>Channel</Button>
            </div>
            {currentView === 'Notifications' && (
                <div className="content-display">
                    {Lists.map((notification, index) => (
                        <div key={index} className="notification-item flex items-center mb-4">
                            <Avatar alt="User Avatar" src={user[0].avatar} className="mr-2"/>
                            <span>{notification}</span>
                            <Button variant="outline" className="button-small" style={{ maxWidth: 'fit-content' }} onClick={() => handleAccept(notification)}>Accepter</Button>
                            <Button variant="outline" className="button-small" style={{ maxWidth: 'fit-content' }} onClick={() => handleDecline(notification)}>Décliner</Button>
                        </div> // Affichage des notifications avec boutons pour accepter ou décliner
                    ))}
                </div>
            )}
            {currentView === 'Friends' && (
                <div className="content-display">
                    {Lists.map((friend, index) => (
                    <div key={index} className="notification-item" onClick={() => fetchFriendChatHistory(friend)}>
                        <span>{friend}</span>
                        <Button variant="outline" className="button-small" onClick={(e) => {
                        e.stopPropagation(); // Prevents the click from triggering the parent's onClick event
                        handleUnfriend(friend);
                    }}>
                    Unfriend
                    </Button>
                </div> // Each friend is now clickable
            ))}
            </div>
        )}
            {currentView === 'Blocked' && (
                <div className="content-display">
                    {Lists.map((blockedUser, index) => (
                        <div key={index} className="blocked-item">
                            <span>{blockedUser}</span>
                            <Button variant="outline" className="button-small" onClick={() => handleUnblock(blockedUser)}>Unblock</Button>
                        </div> // Affichage des utilisateurs bloqués avec bouton pour débloquer
                    ))}
                </div>
            )}
            {currentView === 'Channel' && (
                <div className="content-display mt-4">
                    {Lists.map((channel, index) => (
                        <div key={index} className="blocked-item flex items-center mb-4">
                        <span>{channel}</span>
                        <Button variant="outline" className="button-small w-auto" style={{ maxWidth: 'fit-content' }} onClick={() => handleLeave(channel)}>leave</Button>
                    </div> // Affichage des utilisateurs bloqués avec bouton pour débloquer // Affichage des canaux
                    ))}
                </div>
            )}
            <div className="functionality-content">
                {/* Contenu qui change en fonction des boutons cliqués */}
            </div>
            <div className="additional-features">
                <div className="block-user">
                    <input
                        type="text"
                        value={blockInput}
                        onChange={(e) => setBlockInput(e.target.value)}
                        placeholder="Block ID"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleBlock}>Block</Button>
                    <input
                        type="text"
                        value={ChannelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Channel Name"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleOpen}>Create Channel</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                     <Box sx={style}>
                        <div>
                     <input
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                        checked={channelVisibility === 'public'}
                        onChange={(e) => setChannelVisibility(e.target.value)}
                    />
                    <label htmlFor="public" className="mr-4">Public</label>
                    <input
                        type="radio"
                        id="private"
                        name="visibility"
                        value="private"
                        checked={channelVisibility === 'private'}
                        onChange={(e) => setChannelVisibility(e.target.value)}
                    />
                    <label htmlFor="private">Private</label>
                    </div>
                    {channelVisibility === 'private' && (
                    <div className="mt-4">
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Channel password"
                      required
                      fullWidth
                      style={{ width: '200px' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                    )}
                    <Button variant="outline" className="button-small mt-4" onClick={handleCreateChannel}>Create Channel</Button>
                    </Box>
                    </Modal>
                </div>
                <div className="visibility-options">
                 </div>
                <div className="add-user">
                    <input
                        type="text"
                        value={addInput}
                        onChange={(e) => setaddInput(e.target.value)}
                        placeholder="Add User"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleadd}>Add</Button>
                    <input
                        type="text"
                        value={joinChannel}
                        onChange={(e) => setJoinChannel(e.target.value)}
                        placeholder="Channel Name"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleJoinChannel}>Join Channel</Button>
                </div>
            </div>
        </div>
        <div className="chat-container">
    <div className="message-thread">
        {/* Rendering chat messages */}
        {chatHistory && chatHistory.map((message, index) => (
            <div key={index} className="chat-message">
                <div className="message-info">
                    <span className="sender-id">User : {message.senderPseudo} at  </span>
                    <span className="message-time">{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="message-content">{message.content}</p>
            </div>
        ))}
    </div>
    <div className="chat-input-container">
        <input 
            type="text" 
            placeholder="Type a message..." 
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
        />
        <button 
            className="chat-send-button"
            onClick={sendMessage}
        >
            Send
        </button>
    </div>
</div>
    </div>
    );
}
export default social;