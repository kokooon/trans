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

type ChannelMember = {
	id: number;
	pseudo: string;
	avatar: string;
	status: UserStatus;
	channelStatus: string;
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
	const [activeChannelId, setActiveChannelId] = useState<number>(0);
    const navigate = useNavigate();
	const [userChannelStatus, setUserChannelStatus] = useState<string | null>(null);
	const [channelMembersIds, setchannelMembersIds] = useState<ChannelMember[]>([]);
	const [lastMessages, setLastMessages] = useState<LastMessages>({});
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [friendsList, setFriendsList] = useState<Friend[]>([]); 
    const [blockedList, setblockedList] = useState<Friend[]>([]);
    const [friendsRequestList, setFriendsRequestList] = useState<Friend[]>([]);
	const [gameInvit, setGameInvit] = useState<Friend[]>([]);
    const { socket } = useSocket();
    const [inputMessage, setInputMessage] = useState('');
    const [chatContext, setChatContext] = useState<{ channelname: string, id: number, userIds: number }>({ channelname: 'null', id: 0, userIds: 0 });
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [user, setUser] = useState<any | null>(null);
    const [anchorElArray, setAnchorElArray] = useState<(HTMLElement | null)[]>([]);
    const [channelAnchorElArray, setChannelAnchorElArray] = useState(new Array(channelList.length).fill(null));
    const [memberAnchorElArray, setMemberAnchorElArray] = useState(new Array(channelMembersIds.length).fill(null)); 
    const [activeFriend, setActiveFriend] = useState<string | null>(null);
    const [activeChannel, setActiveChannel] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
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
      if (socket) {
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
            if (currentView === 'Channel' && chatContext.id === message.channelId) {
				      fetchChannelChatHistory(message.channelName.toString());
            }
				      fetchLastChannelMessage(channelList);
        });

          socket.on('friendConnected', () => {
            if (currentView === 'Friends')
              getFriends();
        });

		socket.on('gameInvite', () => {
				console.log('in gameInvit in social');
			  navigate('/gameInvit');
		  });

        socket.on('friendDisconnected', () => {
          if (currentView === 'Friends')
            getFriends();
        });

        socket.on('new_friend', () => {
          if (currentView === 'Friends')
            getFriends();
        });

        socket.on('new_notification', () => {
          if (currentView === 'Notifications') {
              getNotifications();
              console.log('omg wtf');
          }
        });

        socket.on('channelMembersListChange', (data: any) => {
          if (currentView === 'Channel' && activeChannel === data.name) {
              getChannelMembersId(data.id);
          }
        });

        socket.on('refreshChannelList', () => {
          if (currentView === 'Channel') {
              getChannel();
          }
        });

          // Clean up the listener
          return () => {
			socket.off('gameInvite')
            socket.off('refreshChannelList');
            socket.off('channelMembersListChange');
            socket.off('friendConnected');
            socket.off('new_message');
            socket.off('friendDisconnected');
            socket.off('new_friend');
            socket.off('new_notification');
			socket.off('new_channel_message');
          };
        }
      }, [socket, chatHistory, friendsList, friendsRequestList, lastMessages, channelMembersIds, channelList]);

      const handleClick = (index: number, type: string) => (event: React.MouseEvent<HTMLElement>) => {
        const anchorElArray = type === 'channel' ? channelAnchorElArray : memberAnchorElArray;
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = event.currentTarget;
        
        // Update the corresponding state array based on the type
        if (type === 'channel') {
          setChannelAnchorElArray(newAnchorElArray);
        } else if(type === 'member'){
          setMemberAnchorElArray(newAnchorElArray);
        } else {
          setAnchorElArray(newAnchorElArray);
        }
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
		const gameinvit: any[] = [];
		for (let i = 0; i < userData[0].GameNotifs.length; i++) {
    		const friendId = userData[0].GameNotifs[i];
    		const responsetwo = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
        	method: 'GET',
       		credentials: 'include',
    	});
    	if (responsetwo.ok) {
        	const responseData = await responsetwo.json();
        	gameinvit.push(responseData); // Make sure the variable name matches the declaration
   		} else {
        console.error('Get friends failed for friendId:', friendId);
    	}
	}
		setGameInvit(gameinvit); // Make sure this function or variable name is correctly defined
		console.log('game invit = ', gameinvit);
		gameInvit;
    } catch (error) {
        console.error('Error during get notifs:', error);
    }
};

const getChannelMembersId  = async (channelId: number) => {
	let ChannelMembers = [];
	try {
		const response = await fetch(`http://127.0.0.1:3001/channels/returnMembers/${channelId}`, {
    		method: 'GET',
    		headers: {
      		'Content-Type': 'application/json',
    		},
    		credentials: 'include',
  		});
		if (response.ok){
			const membersIds = await response.json(); // === number[]
			for (const friendId of membersIds) {
				const responsetwo = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
              	method: 'GET',
              	credentials: 'include',
          		});
          		if (responsetwo.ok) {
            		const memberData = await responsetwo.json();
					//returnMemberStatus/:userId/:channelId
					const responsethree = await fetch(`http://127.0.0.1:3001/channels/returnMemberStatus/${friendId}/${channelId}`, {
						method: 'GET',
						credentials: 'include',
					});
					if (responsethree.ok){
						 const status = await responsethree.text();
						 if (user[0].id === memberData.id)
						 	setUserChannelStatus(status);
						 const member = {
							id: memberData.id,
							pseudo: memberData.pseudo,
							avatar: memberData.avatar,
							status: memberData.status,
							channelStatus: status
						}
						ChannelMembers.push(member);
					}
          		} else {
              		console.error('Get member failed for number');
          		}
      		}
      		setchannelMembersIds(ChannelMembers);
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
		}
    }
    setChannelList(List);
    fetchLastChannelMessage(List);
}

const handleAcceptGame = async (friend: number, index: number) => {
	friend; //id number 1
	user[0].id //id number 2
	index;
	const data = {
		AcceptId: user[0].id,
		branlix2000: friend,
	  }
    try {
    const response = await fetch('http://127.0.0.1:3001/users/removeGameNotif', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ inviteRecipientId: friend, userId: user[0].id }),
      });
      if (!response.ok) {
          throw new Error('La réponse du réseau n’était pas correcte');
      }
	}catch (error){
		console.log('unable to add gameNotif');
	}
	if (socket)
		socket.emit('matchmaking:Invitation', data);
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

  const isUserMutedInChannel = async (channelId: number, userId: number) => {
	try {
	  const response = await fetch(`http://127.0.0.1:3001/channels/isMuted/${channelId}/${userId}`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
		credentials: 'include',
	  });
	  if (response.ok) {
		const { isMuted } = await response.json();
		return isMuted;
	  }
	  console.log('Response not OK when checking mute status');
	} catch (error) {
	  console.log('Error checking mute status', error);
	}
	return false; // Assume not muted if there's an error
  };

  const sendMessage = async () => {
	let membersIDS;
    if (inputMessage.trim() === '') return; // Prevent sending empty messages
	if (chatContext.id) {
		const isMuted = await isUserMutedInChannel(chatContext.id, user[0].id);
    	if (isMuted) {
      		console.log('User is muted and cannot send messages in this channel.');
      		return; // Exit the function to prevent sending the message
    	}
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
        if (socket) {
			if (!chatContext.id){
				console.log('emit here0');
				socket.emit('new_message', messagedata);
			}
			else{
				socket.emit('new_channel_message', messagedata);
			}
		}
    }
    catch (error) {
        console.log("unable to add message");
    }
    setInputMessage(''); // Clear input field after sending
};


const fetchChannelChatHistory = async (channelName: string) => {
	let blockedUsers;
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
	let channelData;
	let allUsersIds;
  try {
    if (channelVisibility === 'public'){
		const responsethree = await fetch ('http://127.0.0.1:3001/users/allIds', {
			method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
      credentials: 'include',
      });
	  if (responsethree.ok) {
		allUsersIds = await responsethree.json();
	  }
	}
	else
		allUsersIds = user[0].id;
	channelData = {
		name: ChannelName, // From your state
		password: passwordInput, // From your state, could be empty if not private
		visibility: channelVisibility, // From your state
		admin: user[0].id,
		owner: user[0].id,
		memberIds: allUsersIds // The current user's ID
	  }
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
      body: JSON.stringify({ channelId: newChannel.id, userId: allUsersIds }),
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
  let channelId;
  try {
    const response = await fetch(`http://127.0.0.1:3001/channels/findChannelByName/${joinChannel}`, {
      method: 'POST',  // Changez la méthode pour POST
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ passwordInput }),  // Envoyez un objet avec le mot de passe dans le corps de la requête
    });
      if (response.ok){
          const responseData = await response.json();
          const responsefive = await fetch(`http://127.0.0.1:3001/channels/isBanned/${responseData.id}/${user[0].id}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              },
              credentials: 'include', // if you're including credentials like cookies
              });
              if (responsefive.ok) {
                  const data = await responsefive.json();
                 if (data === 'Banned') {
                    console.log('user is banned');
                    return ;
                 }
                 else if (data === 'ok')
                    console.log('not banned');
              }
          if (responseData.password) {
              if (!passwordInput){
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
              console.log('cant add channel id in user');
			        return ;
          }
          channelId = responseData.id;
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
  if (socket) {
    const data = {
      name: joinChannel,
      id: channelId
    }
    socket.emit('channelMembersListChange', data);
  } else {
    console.error('Socket is null');
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

const handleInvite  = async (friendId: number) => {
	try {
		const response = await fetch('http://127.0.0.1:3001/users/gameNotif', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ inviteRecipientId: friendId, userId: user[0].id }),
      });
      if (!response.ok) {
          throw new Error('La réponse du réseau n’était pas correcte');
      }
	}catch (error){
		console.log('unable to add gameNotif');
	}
}

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
  if (currentView === 'Friends')
    fetchFriendChatHistory(friendId);
  else{
      if (activeChannel)
          fetchChannelChatHistory(activeChannel);
  }
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

//setAsAdmin(member.id)
const setAsAdmin  = async (newadmin: number, channelName: string, channelId: number) => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/channels/setAsAdmin`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ newAdmin: newadmin, channel: channelName}),
      });
	  if (response.ok){
			console.log('sucessfully set as admin');
	  }
	  else{
			console.log('failed to set as admin');
	  }
	}catch(error){
		console.log('cant set as admin', error)
	}
	//getChannelMembersId(channEL);
  if (socket) {
    const data = {
      name: channelName,
      id: channelId
    }
    socket.emit('channelMembersListChange', data);
  } else {
    console.error('Socket is null');
  }
}

//Kick(member.id, activeChannel, activeChannelId)
const Kick  = async (kickid: number, channelname: string, channelid: number) => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/channels/kick`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ kickId: kickid, channel: channelname}),
      });
	  if (response.ok){
			console.log('sucessfully set as admin');
	  }
	  else{
			console.log('failed to set as admin');
	  }
    const responsetwo = await fetch('http://127.0.0.1:3001/users/leaveChannel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Inclure les cookies avec la requête
		body: JSON.stringify({ kickId: kickid, channelId: channelid}),
	});
	if (responsetwo.ok){
		console.log('sucessfully kicked');
  	}
  	else{
		console.log('failed to kick');
  	}
	}catch(error){
		console.log('cant kick the user, ', error);
	}
  if (socket) {
    const data = {
      name: channelname,
      id: channelid
    }
    socket.emit('channelMembersListChange', data);
    socket.emit('refreshChannelList', kickid);
  } else {
    console.error('Socket is null');
  }
}

const handleDeletePassword  = async (channel: Channel) => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/channels/deletePassword`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ channelid: channel.id}),
      });
      if (!response.ok) {
          throw new Error('La réponse du réseau n’était pas correcte');
      }
	}catch(error){
		console.log('unable to delete password', error);
	}
}

const Mute  = async (banid: number, channelname: string, channelid: number) => {
	banid;
	channelname;
	channelid;
	try {
		const response = await fetch('http://127.0.0.1:3001/channels/mute', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ muteId: banid, channel: channelid}),
      });
	  if (response.ok){
			console.log('sucessfully set as admin');
	  }
	  else{
			console.log('failed to set as admin');
	  }
	}catch (error) {
		console.log('error while trying to mute');
	}
}

const Ban  = async (Banid: number, channelname: string, channelid: number) => {
	try {
		const response = await fetch('http://127.0.0.1:3001/channels/Ban', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies avec la requête
          body: JSON.stringify({ banId: Banid, channel: channelname}),
      });
	  if (response.ok){
			console.log('sucessfully set as admin');
	  }
	  else{
			console.log('failed to set as admin');
	  }
    const responsetwo = await fetch('http://127.0.0.1:3001/users/leaveChannel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Inclure les cookies avec la requête
		body: JSON.stringify({ kickId: Banid, channelId: channelid}),
	});
	if (responsetwo.ok){
		console.log('sucessfully kicked');
  	}
  	else{
		console.log('failed to kick');
  	}
	}catch(error){
		console.log('cant kick the user, ', error);
	}
  if (socket) {
    const data = {
      name: channelname,
      id: channelid
    }
    socket.emit('channelMembersListChange', data);
    socket.emit('refreshChannelList', Banid);
  } else {
    console.error('Socket is null');
  }
}


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
                        <Conversation name={user.pseudo} info="Veux-tu être mon ami ?" onClick={handleClick(index, 'notification')}>
                        <Avatar src={user.avatar}/>
                        </Conversation>
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'black' }} onClick={() => navigate(`/profile/${user.pseudo}`)}>Profile</MenuItem>
                        <MenuItem style={{ color: 'green' }} onClick={() => handleAccept(user.pseudo, index)}>Accepter</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleDecline(user.pseudo, index)}>Supprimer</MenuItem>
                        </Menu>
                        </div>
                    ))}
                    {gameInvit.map((invite, index) => (
                        <div key={index}>
                        <Conversation name={invite.pseudo} info="Veux-tu jouer avec moi ?" onClick={handleClick(index, 'notification')}>
                        <Avatar src={invite.avatar}/>
                        </Conversation>
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'black' }} onClick={() => navigate(`/profile/${invite.pseudo}`)}>Profile</MenuItem>
                        <MenuItem style={{ color: 'green' }} onClick={() => handleAcceptGame(invite.id, index)}>Accepter</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleDecline(invite.pseudo, index)}>Supprimer</MenuItem>
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
                    info={ lastMessages[friend.id] || ''}    /*lastMessages[friend.id]*/
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
					            setActiveChannelId(channel.id);
                      fetchChannelChatHistory(channel.name);
                      getChannelMembersId(channel.id);
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
                            onClick={handleClick(index, 'friends')}/>
                        )}
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'black' }} onClick={() => navigate(`/profile/${user.pseudo}`)}>Profile</MenuItem>
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
                            onClick={handleClick(index, 'blocked')}/>
                        )}
                        <Menu anchorEl={anchorElArray[index]} open={Boolean(anchorElArray[index])} onClose={() => {const newAnchorElArray = [...anchorElArray]; newAnchorElArray[index] = null; setAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'black' }} onClick={() => navigate(`/profile/${user.pseudo}`)}>Profile</MenuItem>
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
                          onClick={handleClick(index, 'channel')}/>
                        )}
                        <Menu anchorEl={channelAnchorElArray[index]} open={Boolean(channelAnchorElArray[index])} onClose={() => {const newAnchorElArray = [...channelAnchorElArray]; newAnchorElArray[index] = null; setChannelAnchorElArray(newAnchorElArray);}}>
                        <MenuItem style={{ color: 'orange' }} >change Password</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleDeletePassword(channel)}>Delete Password</MenuItem>
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
              {currentView === 'Channel' && activeChannel && (
                <Sidebar position="right">
                  <ExpansionPanel open title="Users">
                    {channelMembersIds.map((member, index) => (
                      <div key={index}>
                        <Conversation
                          name={member.pseudo} 
                          info={ member.channelStatus || 'Loading...'}
                          onClick={
							handleClick(index, 'member')}>
                          <Avatar src={member.avatar} status={member.status}/>
						  </Conversation>
      						<Menu 
        						anchorEl={memberAnchorElArray[index]} 
        						open={Boolean(memberAnchorElArray[index])} 
        						onClose={() => {
          						const newAnchorElArray = [...memberAnchorElArray]; 
          						newAnchorElArray[index] = null; 
          						setMemberAnchorElArray(newAnchorElArray);
								//SET WHAT U NEED
								setBlockInput(member.pseudo);
        						}}>
								<MenuItem style={{ color: 'black' }} onClick={() => navigate(`/profile/${member.pseudo}`)}>Profile</MenuItem>
								{(user[0].id !== member.id )&& (
          						<>
        						<MenuItem onClick={() => {handleInvite(member.id);}}>invite game</MenuItem>
        						<MenuItem onClick={() => {handleBlock(member.id);}}>Block</MenuItem>
								</>
								)}
								{(userChannelStatus === 'Owner' && (member.channelStatus === 'Member'))&& (
          						<>
        						<MenuItem onClick={() => {setAsAdmin(member.id, activeChannel, activeChannelId);}}>set as admin</MenuItem>
								</>
								)}
								{(userChannelStatus === 'Owner' && (user[0].id !== member.id))&& (
          						<>
        						<MenuItem style={{ color: 'red' }} onClick={() => {Kick(member.id, activeChannel, activeChannelId);}}>Kick</MenuItem>
                    			<MenuItem style={{ color: 'red' }} onClick={() => {Ban(member.id, activeChannel, activeChannelId);}}>Ban</MenuItem>
								<MenuItem style={{ color: 'red' }}onClick={() => {Mute(member.id, activeChannel, activeChannelId);}}>Mute</MenuItem>
								</>
								)}
        						{/* Only show the following buttons for Admins/Owners clicking on Members */}
        						{(user[0].id !== member.id && member.channelStatus === 'Member' && 
         						userChannelStatus === 'Admin') && (
          						<>
            					<MenuItem style={{ color: 'red' }}onClick={() => {Mute(member.id, activeChannel, activeChannelId);}}>Mute</MenuItem>
            					<MenuItem style={{ color: 'red' }} onClick={() => {Kick(member.id, activeChannel, activeChannelId);}}>Kick</MenuItem>
                      <MenuItem style={{ color: 'red' }} onClick={() => {Ban(member.id, activeChannel, activeChannelId);}}>Ban</MenuItem>
          						</>
        						)}
      						</Menu>
    					</div>
 					))}
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