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
} from "@chatscope/chat-ui-kit-react";
import { Button } from "@/lib/components/ui/button";
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
import { UserNav } from '@/lib/components/ui/user-nav';
import { useSocket } from '../../components/utils/socketContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../../styles/social.css"

type UserStatus = 'available' | 'invisible';

type ChatMessage = {
  senderPseudo: string;
  content: string;
  createdAt: string;
  avatar: string;
  };

type Friend = {
  pseudo: string;
  avatar: string;
  status: UserStatus;
};

const social = () => {
    const [friendsList, setFriendsList] = useState<Friend[]>([]);
    const [friendsRequestList, setFriendsRequestList] = useState<Friend[]>([]);
    const { socket } = useSocket();
    const [inputMessage, setInputMessage] = useState('');
    const [chatContext, setChatContext] = useState<{ id: number, userIds: number }>({ id: 0, userIds: 0 });
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [anchorElArray, setAnchorElArray] = useState<(HTMLElement | null)[]>([]);
    const [activeFriend, setActiveFriend] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    Lists;
    // const [blockInput, setBlockInput] = useState(''); // Valeur de l'entrée de texte pour bloquer
    // const [addInput, setaddInput] = useState(''); // Valeur de l'entrée de texte pour add
    // const [ChannelName, setChannelName] = useState(''); // Valeur de l'entrée de texte pour cree channel
    // const [passwordInput, setPasswordInput] = useState('');
    // const [joinChannel, setJoinChannel] = useState('');
    // const [channelVisibility, setChannelVisibility] = useState('public');
    // const [showPassword, setShowPassword] = useState<boolean>(false);
    // const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    useEffect(() => {
      const fetchData = async () => {
        const userData = await fetchUserDetails();
        setUser(userData); 
      };
      fetchData();
      console.log('in useEffects');
      if (socket) {
          console.log('socket exist');
          socket.on('new_message', (message: any) => {
              console.log('in new message listener');
              if (currentView === 'Friends' && chatContext.userIds === message.senderId) {
                fetchChat(message);
              }
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

          // Clean up the listener
          return () => {
            socket.off('friendConnected');
            socket.off('new_message');
            socket.off('friendDisconnected');
          };
        }
      }, [socket, chatHistory, friendsList]);

      const handleClick = (currentIndex: number) => (event: React.MouseEvent<HTMLElement>) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[currentIndex] = event.currentTarget;
        setAnchorElArray(newAnchorElArray);
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
      console.log('friend list = ', newFriendsList);
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

const fetchChat = async (messageData: any) => {
  const chatHistoryResponse = await fetch(`http://127.0.0.1:3001/chatHistory/history/${messageData.senderId}/${messageData.recipientId}`, {
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
        setChatHistory(chathistory);
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
    avatar: user[0].id,
    createdAt: new Date(),
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
        // Emit the 'new message' event to the server with the messageData
        if (socket)
            socket.emit('new_message', messagedata)
        // Handle the acknowledgment from the server
        // Optionally add the message to the chat history state directly
        //fetchFriendChatHistory(chatContext.userIds);
    }
    catch (error) {
        console.log("unable to add message");
    }
    setInputMessage(''); // Clear input field after sending
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
                 {friendsRequestList.map((user,index) => (
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
                    info="dernier message reçu" 
                    onClick={() => {
                    setActiveFriend(friend.pseudo);
                    fetchFriendChatHistory(friend.pseudo);
                      }} 
                      active={friend.pseudo === activeFriend}
                      >
                    <Avatar src={friend.avatar} status={friend.status}/>
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
                  <ConversationHeader.Actions>
                    <EllipsisButton orientation="vertical" />
                  </ConversationHeader.Actions>          
                </ConversationHeader>
                <MessageList typingIndicator={isTyping ? <TypingIndicator content={`${activeFriend} is typing`} /> : null}>
                  <MessageSeparator content="Saturday, 30 November 2077" />
                  {chatHistory.map((chatMessage, index) => (
                  <Message 
                  key={index}
                  model={{
                  message: chatMessage.content,
                  sentTime: chatMessage.createdAt,
                  sender: chatMessage.senderPseudo,
                  direction: chatMessage.senderPseudo === activeFriend ? 1 : 0, // Adjust direction based on sender
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
            </MainContainer>
          </div>
);
}
export default social;