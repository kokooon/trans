import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {useState, useEffect} from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
  ConversationHeader,
  EllipsisButton,
  MessageSeparator,
  TypingIndicator,
  Avatar,
  ExpansionPanel,
} from "@chatscope/chat-ui-kit-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";
import { fetchUserDetails, isTokenValid, isUserConnected } from '../../components/utils/UtilsFetch';
import { UserNav } from '@/lib/components/ui/user-nav';
import { useSocket } from '../../components/utils/socketContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import ConstructionIcon from '@mui/icons-material/Construction';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TextField, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "../../styles/social.css"
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


type UserStatus = "available" | "unavailable" | "away" | "dnd" | "invisible" | "eager";

type ChatMessage = {
  senderPseudo: string;
  content: string;
  createdAt: string;
  avatar: string;
  };

type Friend = {
  id: number;
  pseudo: string;
  avatar: string;
  status: UserStatus;
};

type Channel = {
	id: number;
	name: string;
	membersIds: number[],
	owner: number,
	admins: number[];
}

interface LastMessages {
	[key: number]: string;
  }

const social = () => {
    const navigate = useNavigate();
	const [channelMembersIds, setchannelMembersIds] = useState<Friend[]>([]);
	const [lastMessages, setLastMessages] = useState<LastMessages>({});
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [friendsList, setFriendsList] = useState<Friend[]>([]); 
    const [blockedList, setblockedList] = useState<Friend[]>([]);
    const [friendsRequestList, setFriendsRequestList] = useState<Friend[]>([]);
    const { socket } = useSocket();
    const [inputMessage, setInputMessage] = useState('');
    const [chatContext, setChatContext] = useState<{ channelname: string, id: number, userIds: number }>({ channelname: 'null', id: 0, userIds: 0 });
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, ] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [anchorElArray, setAnchorElArray] = useState<(HTMLElement | null)[]>([]);
    const [activeFriend, setActiveFriend] = useState<string | null>(null);
    const [activeChannel, setActiveChannel] = useState<string | null>(null);
    const [activeUser, setActiveUser] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    
    Lists;
    const [blockInput, setBlockInput] = useState<string | null>(null); // Valeur de l'entrée de texte pour bloquer
    const [addInput, setaddInput] = useState(''); // Valeur de l'entrée de texte pour add
    const [ChannelName, setChannelName] = useState(''); // Valeur de l'entrée de texte pour cree channel
    const [passwordInput, setPasswordInput] = useState('');
    const [joinChannel, setJoinChannel] = useState('');
    const [channelVisibility, setChannelVisibility] = useState('public');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSecondOpen = () => setSecondOpen(true);
    const handleSecondClose = () => setSecondOpen(false);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const isValid = await isTokenValid();
          if (!isValid) {
              navigate('/login');
              return;
          }
          const userData = await fetchUserDetails();
          if (userData[0].is2FAEnabled !== false) {
              const isConnected = await isUserConnected();
              console.log(isConnected);
              if (!isConnected) {
                  navigate('/2fa');
              }
          }
          setUser(userData);
          }
          catch (error) {
              console.error('Error:', error);
          }
      };
      fetchData();
      console.log('in useEffects');
      if (socket) {
          console.log('socket exist');
          socket.on('new_message', (message: any) => {
              if (currentView === 'Friends' && (chatContext.userIds === message.senderId) || message.senderId === user[0].id) {
                if (user[0].id === message.senderId){
					fetchLastMessage(friendsList);
					fetchFriendChatHistory(message.recipientId);
				}
                else{
					fetchLastMessage(friendsList);
					fetchFriendChatHistory(message.senderId);
				}
              }
          });

		  socket.on('new_channel_message', (message: any) => {
            console.log('in new_channel_message listener = ', message.channelName);
            if (currentView === 'Channel' && chatContext.id === message.channelId)
				fetchLastChannelMessage(channelList);
				fetchChannelChatHistory(message.channelName.toString());
        });

          socket.on('friendConnected', () => {
            console.log('in friendConnected listener');
            if (currentView === 'Friends')
              getFriends();
        });

        socket.on('friendDisconnected', () => {
          console.log('in friendDisconnected listener');
          if (currentView === 'Friends')
            getFriends();
        });

        socket.on('new_friend', () => {
          console.log('new friend');
          if (currentView === 'Friends')
            getFriends();
        });

        socket.on('new_notification', () => {
          console.log('new notification');
          if (currentView === 'Notifications')
            getNotifications();
        });

          // Clean up the listener
          return () => {
            socket.off('friendConnected');
            socket.off('new_message');
            socket.off('friendDisconnected');
            socket.off('new_friend');
            socket.off('new_notification');
			socket.off('new_channel_message');
          };
        }
      }, [socket, chatHistory, friendsList, friendsRequestList, lastMessages]);

      const handleClick = (currentIndex: number) => (event: React.MouseEvent<HTMLElement>) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[currentIndex] = event.currentTarget;
        setAnchorElArray(newAnchorElArray);
    };
      
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };


  const getNotifications = async () => {
    setCurrentView('Notifications');
    const userData = await fetchUserDetails();
    try {
        const friendsRequestList = []; // Créez une nouvelle liste pour les amis

        for (let i = 0; i < userData[0].friendNotif.length; i++) {
            const friendId = userData[0].friendNotif[i];
            console.log(user[0].friendNotif[i]);
            const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const responseData = await response.json();
                friendsRequestList.push(responseData);
            } else {
                console.error('Get friends failed for friendId:', friendId);
            }
        }
        setFriendsRequestList(friendsRequestList);
    } catch (error) {
        console.error('Error during get notifs:', error);
    }
};

//const removePassword  = async () => {
//}
//const modifyPassword  = async () => {
//}

const getChannelMembersId  = async () => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/channels/returnMembers/${chatContext.id}`, {
    		method: 'GET',
    		headers: {
      		'Content-Type': 'application/json',
    		},
    		credentials: 'include',
  		});
		if (response.ok){
			const membersIds = await response.json(); // === number[]
			const newMembersList = [];
			for (const friendId of membersIds) {
				const responsetwo = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
              	method: 'GET',
              	credentials: 'include',
          		});
          		if (responsetwo.ok) {
            		const memberData = await responsetwo.json();
           			newMembersList.push(memberData);
          		} else {
              		console.error('Get member failed for number');
          		}
      		}
			console.log('members list = ', newMembersList);
      		setchannelMembersIds(newMembersList);
			channelMembersIds;
		}
		else
			console.log('cant get channel members ids');
	}catch(error){
		console.log('error while getting members Ids');
	}
}


const getFriends  = async () => {
  setCurrentView('Friends');
  const userData = await fetchUserDetails();
  try {
    const newFriendsList = []; // Créez une nouvelle liste pour les amis
      for (let i = 0; i < userData[0].friends.length; i++) {
          const friendId = userData[0].friends[i];
          const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
              method: 'GET',
              credentials: 'include',
          });
          if (response.ok) {
            const friendData = await response.json();
            newFriendsList.push(friendData);
          } else {
              console.error('Get friends failed for friendId:', friendId);
          }
      }
      setFriendsList(newFriendsList);
	  fetchLastMessage(newFriendsList);
  } catch (error) {
      console.error('Error during get friends:', error);
  }
};

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
              const responseData = await response.json();
              List.push(responseData);
          } else {
              console.error('Get friends failed for friendId:', friendId);
          }
      }
      setblockedList(List)
  } catch (error) {
      console.error('Error during get friends:', error);
  }
};

const fetchLastChannelMessage = async (channels: Channel[]) => {
	let blockedUsers;
	for (const channel of channels) {
    	try {
				const responsefor = await fetch(`http://127.0.0.1:3001/users/getBlocked/${user[0].id}`, {  //get banlist;
    			method: 'GET',
    			headers: {
      				'Content-Type': 'application/json',
    			},
    			credentials: 'include',
  				});
    			if (responsefor.ok) {
					const blockedId = await responsefor.json();
					blockedUsers = blockedId.map((id: string) => parseInt(id, 10));
					if (blockedUsers.length === 0)
						blockedUsers = [0];
				}
				else {
					console.log('reponse not ok');
				}
				const response = await fetch(`http://127.0.0.1:3001/chatHistory/history/channel/${channel.id}/${blockedUsers}?lastOnly=true`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});
				if (response.ok) {
					const responseLastMessage = await response.json();
					setLastMessages((prevMessages: LastMessages) => ({
						...prevMessages,
						[channel.id]: responseLastMessage.content,
					}));
				} else {
					console.error('Error fetching chat history');
					return ; // Return error as a string
				}
    	} catch (error) {
        	console.log('Unable to fetch last message: ', error);
        	return ; // Return error as a string
    	}
	}
};

const getChannel = async () => {
  setCurrentView('Channel');
  const userData = await fetchUserDetails();
  const List = [];
  for (let i = 0; i < userData[0].channels.length; i++) {
      const channelId = userData[0].channels[i];
      const response = await fetch(`http://127.0.0.1:3001/channels/lastMessage/${channelId}`, {
              method: 'GET',
              credentials: 'include',
          });
          if (response.ok) {
			const responseData = await response.json();
			List.push(responseData);
			console.log('channel = ', responseData);
		}
    }
    setChannelList(List);
    fetchLastChannelMessage(List);
}



const handleAccept = async (friend: string, index: number) => {
  console.log('param of accept = ', friend);
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
 if (socket)
 {
   const data = {recipientId: friend };
   socket.emit('new_friend', data)
 }
 getNotifications();
 const newAnchorElArray = [...anchorElArray];
 newAnchorElArray[index] = null;
 setAnchorElArray(newAnchorElArray);
}

const handleDecline = async (friend: string, index: number) => {
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
 const newAnchorElArray = [...anchorElArray];
 newAnchorElArray[index] = null;
 setAnchorElArray(newAnchorElArray);
}

const fetchLastMessage = async (friends: Friend[]) => {
	for (const friend of friends) {
    	try {
        // Logic to get last messages
        	const response = await fetch(`http://127.0.0.1:3001/chatHistory/history/${user[0].id}/${friend.id}?lastOnly=true`, {
            	method: 'GET',
            	headers: {
                	'Content-Type': 'application/json',
            	},
            	credentials: 'include',
        	});
        	if (response.ok) {
            	const responseLastMessage = await response.json();
				setLastMessages((prevMessages: LastMessages) => ({
					...prevMessages,
					[friend.id]: responseLastMessage.content,
				}));
        	} else {
            	console.error('Error fetching chat history');
            	return ; // Return error as a string
        	}
    	} catch (error) {
        	console.log('Unable to fetch last message: ', error);
        	return ; // Return error as a string
    	}
	}
};


const fetchFriendChatHistory  = async (friendId: number) =>  {
  try {
        const userId = Number(user[0].id);
  		setChatContext({ channelname: 'null', id: 0, userIds: friendId });
  		const chatHistoryResponse = await fetch(`http://127.0.0.1:3001/chatHistory/history/${userId}/${friendId}`, {
    	method: 'GET',
    	headers: {
      	'Content-Type': 'application/json',
    	},
    	credentials: 'include',
  		});
      	if (chatHistoryResponse.ok) {
        	const chathistory = await chatHistoryResponse.json();
        	setChatHistory(chathistory);
      	} else {
        console.error('Error fetching chat history');
      	}
    } catch (error) {
    	console.error('Unable to fetch chat history', error);
    }
  };

  const sendMessage = async () => {
	let membersIDS;
    if (inputMessage.trim() === '') return; // Prevent sending empty messages
	if (chatContext.id) {
		try {
		const response = await fetch(`http://127.0.0.1:3001/channels/returnMembers/${chatContext.id}`, {
    	method: 'GET',
    	headers: {
      	'Content-Type': 'application/json',
    	},
    	credentials: 'include',
  		});
    	if (response.ok) {
			const membersId = await response.json();
			membersIDS = membersId.map((id: string) => parseInt(id, 10));
		}
		else {
			console.log('reponse not ok');
		}
		}catch(error) {
		console.log('unable to get membersId from channel', error);
		}
	}
	let messagedata;
    if (chatContext.id === 0) { // It's a private chat
  	messagedata = {
    content: inputMessage,
    senderId: user[0].id, // Assuming user[0].id is the current user's id
    avatar: user[0].avatar,
    createdAt: new Date(),
    recipientId: chatContext.userIds // Array containing both user IDs
  	};
	} else {
  	messagedata = {     // It's a channel chat
    content: inputMessage,
    senderId: user[0].id, // Assuming user[0].id is the current user's id
    avatar: user[0].avatar,
    createdAt: new Date(),
    channelId: chatContext.id,
	recipientId: membersIDS,
	channelName: chatContext.channelname
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
        // Emit the 'new message' event to the server with the messageData
        if (socket) {
			if (!chatContext.id){
				console.log('emit here0');
				socket.emit('new_message', messagedata);
			}
			else{
				socket.emit('new_channel_message', messagedata);
			}
		}
        // Handle the acknowledgment from the server
        // Optionally add the message to the chat history state directly
        //fetchFriendChatHistory(chatContext.userIds);
    }
    catch (error) {
        console.log("unable to add message");
    }
    setInputMessage(''); // Clear input field after sending
};


const fetchChannelChatHistory = async (channelName: string) => {
	let blockedUsers;
  console.log('in fetch channel history', channelName);
  try {
	const response = await fetch(`http://127.0.0.1:3001/channels/findChannelByName/${channelName}`, {
	method: 'GET',
	headers: {
	'Content-Type': 'application/json',
	},
	credentials: 'include',
	});
	if (response.ok) {
		const channel = await response.json();
		setChatContext({ channelname: channelName, id: channel.id, userIds: 0 });
		const responsefor = await fetch(`http://127.0.0.1:3001/users/getBlocked/${user[0].id}`, {  //get banlist;
		method: 'GET',
		headers: {
			  'Content-Type': 'application/json',
		},
		credentials: 'include',
		  });
		if (responsefor.ok) {
			const blockedId = await responsefor.json();
			blockedUsers = blockedId.map((id: string) => parseInt(id, 10));
			if (blockedUsers.length === 0)
				blockedUsers = [0];
		}
		else {
			console.log('reponse not ok');
		}
		const chatHistoryResponse = await fetch(`http://127.0.0.1:3001/chatHistory/history/channel/${channel.id}/${blockedUsers}`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
		credentials: 'include',
	  });
	  if (chatHistoryResponse.ok) {
		const chathistory = await chatHistoryResponse.json();
		setChatHistory(chathistory);
  } else {
	// Handle errors in fetching chat history
	console.error('Error fetching chat history');
  }
	}
	else {
	  console.log('no channel found');
	}
}catch(error){
	console.log('error while fetching channel data', error);
}
}

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
      const response = await fetch(`http://127.0.0.1:3001/channels/findChannelByName/${joinChannel}`, {
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
  let messagedata = {
    recipientId: addInput
  	};
    if (socket) {
      socket.emit('new_notification', messagedata);
  } else {
      console.error('Socket is null');
  }
  setaddInput('');
};

const handleBlock  = async (friendId: number) => {
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
  fetchFriendChatHistory(friendId);
};

const handleUnblock  = async (unblockPseudo: string, friendId: number) => {
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
  fetchFriendChatHistory(friendId);
};

  return (
            <div style={{height: "600px",position: "relative"}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="outline" className={currentView === 'Notifications' ? 'button-small button-small-selected' : 'button-small'} onClick={getNotifications}>Notifications</Button>
              <Button variant="outline" className={currentView === 'Friends' ? 'button-small button-small-selected' : 'button-small'} onClick={getFriends}>Friends</Button>
              <Button variant="outline" className={currentView === 'Blocked' ? 'button-small button-small-selected' : 'button-small'} onClick={getBlock}>Blocked</Button>
              <Button variant="outline" className={currentView === 'Channel' ? 'button-small button-small-selected' : 'button-small'} onClick={getChannel}>Channel</Button>
              <UserNav />
            </div>
            <MainContainer responsive>                
              <Sidebar position="left" scrollable={true}>
              {currentView === 'Notifications' && (
                <ConversationList>
                 {friendsRequestList.map((user, index) => (
                        <div key={index}>
                        <Conversation name={user.pseudo} info="Veux-tu être mon ami ?" onClick={handleClick(index)}>
                        <Avatar src={user.avatar}/>
                        </Conversation>
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'green' }} onClick={() => handleAccept(user.pseudo, index)}>Accepter</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleDecline(user.pseudo, index)}>Supprimer</MenuItem>
                        </Menu>
                        </div>
                    ))}
                  
                </ConversationList>
              )}
              {currentView === 'Friends' && (
                    <ConversationList>
                    {friendsList.map((friend, index) => (
                        <div key={index}>
                        <Conversation 
                    name={friend.pseudo} 
                    info={ lastMessages[friend.id] || 'Loading...'}    /*lastMessages[friend.id]*/
                    onClick={() => {
                    setActiveFriend(friend.pseudo);
                    setBlockInput(friend.pseudo);
                    fetchFriendChatHistory(friend.id);
                      }} 
                      active={friend.pseudo === activeFriend}
                      >
                    <Avatar src={friend.avatar} status={friend.status} />
                </Conversation>
              </div>
                ))}
              </ConversationList>
              )}

              {currentView === 'Blocked' && (
                    <ConversationList>
                    {blockedList.map((blocked, index) => (
                        <div key={index}>
                        <Conversation 
                    name={blocked.pseudo} 
                    info="user blocked" 
                    onClick={() => {
                    setActiveFriend(blocked.pseudo);
                    setBlockInput(blocked.pseudo);
                    fetchFriendChatHistory(blocked.id);
                      }} 
                      active={blocked.pseudo === activeFriend}
                      >
                    <Avatar src={blocked.avatar} status={blocked.status}/>
                </Conversation>
              </div>
                ))}
              </ConversationList>
              )}

              {currentView === 'Channel' && (
                    <ConversationList>
                    {channelList.map((channel, index) => (
                        <div key={index}>
                        <Conversation 
                    name={channel.name} 
                    info={ lastMessages[channel.id] || 'Loading...'}
                    onClick={() => {
                    setActiveChannel(channel.name);
                    fetchChannelChatHistory(channel.name);
					getChannelMembersId();
                      }} 
                      >
                </Conversation>
              </div>
                ))}
              </ConversationList>
              )}
              </Sidebar>
              <ChatContainer>
                <ConversationHeader>
                  <ConversationHeader.Back />              
                  <ConversationHeader.Content userName={activeFriend} info="Active ?? mins ago" />
                  {currentView === 'Channel' && (
                    <ConversationHeader.Content userName={activeChannel} info="Active ?? mins ago" />
                  )}
                  <ConversationHeader.Actions>
                  {currentView === 'Friends' && (
                    <div>
                  {friendsList.map((user,index) => (
                        <div>
                        {user.pseudo === blockInput && (
                          <EllipsisButton
                            orientation="vertical"
                            onClick={handleClick(index)}/>
                        )}
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleBlock(user.id)}>Bloquer</MenuItem>
                        </Menu>
                        </div>
                    ))}
                    </div>
                  )}
                  {currentView === 'Blocked' && (
                    <div>
                  {blockedList.map((user,index) => (
                        <div>
                        {user.pseudo === blockInput && (
                          <EllipsisButton
                            orientation="vertical"
                            onClick={handleClick(index)}/>
                        )}
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'green' }} onClick={() => handleUnblock(user.pseudo, user.id)}>Debloquer</MenuItem>
                        </Menu>
                        </div>
                    ))}
                    </div>
                  )}
                  {currentView === 'Channel' && (
                    <div>
                  {channelList.map((channel,index) => (
                        <div>
                        {channel.name === activeChannel && channel.owner == user[0].id && (
                          <EllipsisButton
                            orientation="vertical"
                            onClick={handleClick(index)}/>
                        )}
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'green' }} >Test</MenuItem>
                        <MenuItem style={{ color: 'green' }} >Test</MenuItem>
                        <MenuItem style={{ color: 'green' }} >Test</MenuItem>
                        <MenuItem style={{ color: 'green' }} >Test</MenuItem>
                        </Menu>
                        </div>
                    ))}
                    </div>
                  )}
                  </ConversationHeader.Actions>          
                </ConversationHeader>
                <MessageList typingIndicator={isTyping ? <TypingIndicator content={`${activeFriend} is typing`} /> : null}>
                  <MessageSeparator content={`31 janvier 2024`} />
                  {chatHistory.map((chatMessage, index) => (
                  <Message
                  key={index}
                  model={{
                  message: chatMessage.content,
                  sentTime: chatMessage.createdAt,
                  sender: chatMessage.senderPseudo,
                  direction: chatMessage.senderPseudo === activeFriend ? 0 : 1, // Adjust direction based on sender
                  position: 0 // Adjust position as necessary
                  }}
                  >
                  <Avatar src={chatMessage.avatar} size="sm" /> {/* Replace with actual avatar logic */}
                  </Message>
                  ))}
                  </MessageList>
                <MessageInput attachButton={false} placeholder="Type message here" value={inputMessage} onChange={(value: string) => setInputMessage(value)} onSend={sendMessage} onFocus={() => setIsTyping(true)}
        onBlur={() => setIsTyping(false)} />
              </ChatContainer>
              {currentView === 'Channel' && activeChannel &&(
              <Sidebar position="right">
                <ExpansionPanel open title="Users">
                <Conversation 
                    name={'test'} 
                    info={ 'Admin' || 'Loading...'}    /*lastMessages[friend.id]*/
                    onClick={() => {
                    setActiveUser('lol');
                      }} 
                      active={'lol' === activeUser}
                      >
                    <Avatar src={'https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg'} status={'available'} />
                </Conversation>
                <Conversation 
                    name={'test2'} 
                    info={ 'Pas admin' || 'Loading...'}    /*lastMessages[friend.id]*/
                    onClick={() => {
                    setActiveUser('not');
                      }} 
                      active={'not' === activeUser}
                      >
                    <Avatar src={'https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg'} status={'available'} />
                </Conversation>
                </ExpansionPanel>
              </Sidebar>  
                
                )}                   
            </MainContainer>
            {currentView === 'Channel' && (
              <div>
            <Fab color="secondary" aria-label="add" style={{ position: 'fixed', bottom: '8rem', right: '4rem' }} onClick={handleSecondOpen}>
              <ConnectWithoutContactIcon />
            </Fab>
            <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '4rem', right: '4rem' }} onClick={handleOpen}>
              <ConstructionIcon />
            </Fab>
            <Modal
                open={secondOpen}
                onClose={handleSecondClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                  <div>
                     <Box sx={style}>
                     <input type="text" value={joinChannel} onChange={(e) => setJoinChannel(e.target.value)} placeholder="Channel Name" className="input-small"/>
                     <input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="password (optional)" className="input-small"/>

                    <Button variant="outline" className="button-small" onClick={handleJoinChannel}>Join Channel</Button>
                    <div>
                    </div>
                    </Box>
                  </div>
            </Modal>
            <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                     <Box sx={style}>
                     <div className="flex items-center justify-center">
                          <input
                        type="text"
                        value={ChannelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Channel Name"
                        className="input-small"
                        />
                        </div>
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
            )}
            {currentView === 'Friends' && (
              <div>
            <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '4rem', right: '4rem' }} onClick={handleOpen}>
              <PersonAddAlt1Icon />
            </Fab>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                  <div>
                     <Box sx={style}>
                     <input
                        type="text"
                        value={addInput}
                        onChange={(e) => setaddInput(e.target.value)}
                        placeholder="Add User"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleadd}>Add</Button>
                    </Box>
                  </div>
            </Modal>
            </div>
            )}
          </div>
);
}
export default social;