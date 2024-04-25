import React from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip, Link, Icon } from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons'; // Ensure you have this icon or use an alternative
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <div style={{
            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
            marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
            display: 'flex',
            alignItems: 'center'
          }}>
            {m.isFile ? (
              <Link href={`http://localhost:5000/downloads/${m.content}`} isExternal download>
              <Icon as={DownloadIcon} w={5} h={5} mr={2} />
              {m.content}
            </Link>
            
            ) : (
              <span>{m.content}</span>
            )}
          </div>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
