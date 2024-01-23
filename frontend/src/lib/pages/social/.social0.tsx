import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {useState} from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  EllipsisButton,
  MessageSeparator,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

const social = () => {

  const [messageInputValue, setMessageInputValue] = useState("");
  return (
            <div style={{height: "600px",position: "relative"}}>
            <MainContainer responsive>                
              <Sidebar position="left" scrollable={false}>
                <Search placeholder="Search..." />
                <ConversationList>                                                     
                  <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                  <Avatar src="https://cdn.intra.42.fr/users/16123060394c02d5c6823dd5962b0cfd/joberle.jpg" status="available"/>
                  </Conversation>
                  <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">

                  </Conversation>
                  
                  <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
   
                  </Conversation>
                  
                  <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
                  
                  </Conversation>
                              
                  <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                  
                  </Conversation>
                                      
                  <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                
                  </Conversation>
                                                      
                  <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you">
                   
                  </Conversation>
                  
                  <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                   
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
                <MessageInput placeholder="Type message here" value={messageInputValue} onChange={val => setMessageInputValue(val)} />
              </ChatContainer>                         
            </MainContainer>
          </div>
);
}
export default social;