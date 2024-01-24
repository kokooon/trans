import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {useState} from 'react';
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
import "../../styles/social.css"

const social = () => {

    const [inputMessage, setInputMessage] = useState('');
    // const [chatContext, setChatContext] = useState<{ id: number, userIds: number }>({ id: 0, userIds: 0 });
    // const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState('Notifications');
    const [, setLists] = useState<string[]>([]);
    const [user, ] = useState<any | null>(null);
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


  return (
            <div style={{height: "600px",position: "relative"}}>
            <Button variant="outline" className={currentView === 'Notifications' ? 'button-small button-small-selected' : 'button-small'} onClick={getNotifications}>Notifications</Button>
            <Button variant="outline" className={currentView === 'Friends' ? 'button-small button-small-selected' : 'button-small'} onClick={getFriends}>Friends</Button>
            <Button variant="outline" className={currentView === 'Blocked' ? 'button-small button-small-selected' : 'button-small'} onClick={getBlock}>Blocked</Button>
            <Button variant="outline" className={currentView === 'Channel' ? 'button-small button-small-selected' : 'button-small'} onClick={getChannel}>Channel</Button>
            <MainContainer responsive>                
              <Sidebar position="left" scrollable={true}>
                <ConversationList>                                                     
                  <Conversation name="test" lastSenderName="test2" info="Yes i can do it for you">
                  <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg" status="invisible"/>
                  </Conversation>
                  <Conversation name="test2" lastSenderName="test" info="Yes i can do it for you">
                  <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg" status="available"/>
                  </Conversation>                
                </ConversationList>
              </Sidebar>
              <ChatContainer>
                <ConversationHeader>
                  <ConversationHeader.Back />
                
                  <ConversationHeader.Content userName="Zoe" info="Active 10 mins ago" />
                  <ConversationHeader.Actions>
                    <EllipsisButton orientation="vertical" />
                  </ConversationHeader.Actions>          
                </ConversationHeader>
                <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
                  <MessageSeparator content="Saturday, 30 November 2019" />
                  <Message model={{
                    message: "Hello my friend",
                    sentTime: "15 mins ago",
                    sender: "Zoe",
                    direction: "incoming",
                    position: "single"
                  }}>
                    </Message>
                </MessageList>
                <MessageInput placeholder="Type message here" value={inputMessage} onChange={val => setInputMessage(val)} />
              </ChatContainer>                         
            </MainContainer>
          </div>
);
}
export default social;