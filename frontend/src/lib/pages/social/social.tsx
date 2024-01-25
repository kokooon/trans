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


const social = () => {

    const { socket } = useSocket();
    const [inputMessage, setInputMessage] = useState('');
    const [chatContext, setChatContext] = useState<{ id: number, userIds: number }>({ id: 0, userIds: 0 });
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [anchorEl, setAnchorEl] = useState<React.SetStateAction<HTMLElement | null>>(null);
    const [activeFriend, setActiveFriend] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
  

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
    

    type ChatMessage = {
      senderPseudo: string;
      content: string;
      createdAt: string;
      };

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
              fetchChat(message);
              
          });
          // Clean up the listener
          return () => {
            socket.off('new_message');
          };
        }
      }, [socket, chatHistory]);

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
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
  console.log('in fetchchat');
  const chatHistoryResponse = await fetch(`http://127.0.0.1:3001/chatHistory/history/${messageData.senderId}/${messageData.recipientId}`, {
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
}

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
    console.log('send');
    if (inputMessage.trim() === '') return; // Prevent sending empty messages
let messagedata;
    if (chatContext.id === 0) { // It's a private chat
  messagedata = {
    content: inputMessage,
    senderId: user[0].id, // Assuming user[0].id is the current user's id
    createdAt: new Date(),
    recipientId: chatContext.userIds // Array containing both user IDs
  };
} else {
  messagedata = {     // It's a channel chat
    content: inputMessage,
    senderId: user[0].id, // Assuming user[0].id is the current user's id
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
                 {Lists.map((notification,index) => (
                        <div key={index}>
                        <Conversation name={notification} info="Veux-tu être mon ami ?" onClick={handleClick}>
                        <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg"/>
                        </Conversation>
                        <Menu anchorEl={anchorEl as Element | undefined} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem style={{ color: 'green' }} onClick={() => handleAccept(notification)}>Accepter</MenuItem>
                        <MenuItem style={{ color: 'red' }} onClick={() => handleDecline(notification)}>Supprimer</MenuItem>
                        </Menu>
                        </div>
                    ))}
                  
                </ConversationList>
              )}
              {currentView === 'Friends' && (
                <ConversationList>
                 {Lists.map((friend,index) => (
                        <div key={index}>
                        <Conversation name={friend} info="{dernier message recu" onClick={() => {setActiveFriend(friend);fetchFriendChatHistory(friend);}} active={friend === activeFriend}>
                        <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg" status="available"/>
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
                  <Message model={{
                    message: "exemple\nde\nmessage",
                    sentTime: "15 mins ago",
                    sender: "Zoe",
                    direction: 1,
                    position: 0
                  }} avatarPosition="br">
                    <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg" size="sm"/>
                    </Message>
                </MessageList>
                <MessageInput attachButton={false} placeholder="Type message here" value={inputMessage} onChange={(value: string) => setInputMessage(value)} onSend={sendMessage} onFocus={() => setIsTyping(true)}
        onBlur={() => setIsTyping(false)} />
              </ChatContainer>                         
            </MainContainer>
          </div>
);
}
export default social;