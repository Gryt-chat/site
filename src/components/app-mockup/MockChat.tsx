import { Avatar, Box, Flex, Text } from "@radix-ui/themes";
import { MdChat, MdVolumeUp } from "react-icons/md";

import type { MockMessage } from "./data";
import { messages as defaultMessages } from "./data";

function MessageRow({ m }: { m: MockMessage }) {
  const content = m.firstInGroup ? (
    <Flex gap="3" style={{ width: "100%", marginTop: 12 }} align="start">
      <Avatar
        radius="full"
        fallback={m.sender[0]}
        style={{
          flexShrink: 0,
          marginTop: 2,
          width: 36,
          height: 36,
          backgroundColor: m.color,
        }}
      />
      <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
        <Flex align="baseline" gap="2" style={{ marginBottom: 2 }}>
          <Text size="2" weight="bold">
            {m.sender}
          </Text>
          {m.time && (
            <Text
              style={{
                fontSize: 10,
                whiteSpace: "nowrap",
                userSelect: "none",
                color: "var(--gray-9)",
              }}
            >
              {m.time}
            </Text>
          )}
        </Flex>
        {m.text && (
          <div style={{ wordBreak: "break-word", fontSize: 13 }}>{m.text}</div>
        )}
      </Flex>
    </Flex>
  ) : (
    <Flex style={{ width: "100%", paddingLeft: 48 }}>
      <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
        {m.text && (
          <div style={{ wordBreak: "break-word", fontSize: 13 }}>{m.text}</div>
        )}
      </Flex>
    </Flex>
  );

  return <div style={{ width: "100%" }}>{content}</div>;
}

interface MockChatProps {
  channelName: string;
  channelType: "text" | "voice";
  messages?: MockMessage[];
  visibleMessageCount?: number;
}

export function MockChat({
  channelName,
  channelType,
  messages = defaultMessages,
  visibleMessageCount,
}: MockChatProps) {
  const visible = visibleMessageCount !== undefined
    ? messages.slice(0, visibleMessageCount)
    : messages;

  return (
    <Box
      overflow="hidden"
      flexGrow="1"
      minWidth="0"
      style={{
        background: "var(--gray-3)",
        borderRadius: "var(--radius-5)",
        contain: "strict",
      }}
    >
      <Flex height="100%" width="100%" direction="column" p="3">
        <Flex
          align="center"
          gap="2"
          style={{
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid var(--gray-6)",
          }}
        >
          {channelType === "voice" ? (
            <MdVolumeUp
              size={18}
              style={{ color: "var(--gray-11)", flexShrink: 0 }}
            />
          ) : (
            <MdChat
              size={18}
              style={{ color: "var(--gray-11)", flexShrink: 0 }}
            />
          )}
          <Text size="4" weight="bold" style={{ color: "var(--gray-12)" }}>
            {channelName}
          </Text>
        </Flex>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "hidden",
            overflowX: "hidden",
            marginBottom: 12,
          }}
        >
          <div>
            {visible.map((m) => (
              <MessageRow key={m.id} m={m} />
            ))}
          </div>
        </div>

        <Box style={{ flexShrink: 0 }}>
          <Flex
            align="center"
            gap="2"
            style={{
              background: "var(--gray-4)",
              borderRadius: "var(--radius-4)",
              padding: "8px 12px",
              border: "1px solid var(--gray-5)",
            }}
          >
            <Text
              size="2"
              style={{ flex: 1, color: "var(--gray-8)", userSelect: "none" }}
            >
              Message #{channelName}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
