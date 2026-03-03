import { Avatar, Box, Flex, Text } from "@radix-ui/themes";
import {
  MdAttachFile,
  MdChat,
  MdInsertEmoticon,
  MdSend,
} from "react-icons/md";

import { ACTIVE_CHANNEL, type MockMessage, messages } from "./data";

function ReactionBadge({ emoji, count }: { emoji: string; count: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 6px",
        fontSize: 12,
        background: "var(--gray-3)",
        border: "1px solid var(--gray-5)",
        borderRadius: "var(--radius-2)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {emoji}
      <span style={{ fontWeight: 500, fontSize: 11 }}>{count}</span>
    </span>
  );
}

function MessageRow({ m }: { m: MockMessage }) {
  if (m.firstInGroup) {
    return (
      <Flex gap="2" style={{ width: "100%", marginTop: 10 }} align="start">
        <Avatar
          radius="full"
          fallback={m.sender[0]}
          size="2"
          style={{
            flexShrink: 0,
            marginTop: 2,
            backgroundColor: m.color,
          }}
        />
        <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
          <Flex align="baseline" gap="2" style={{ marginBottom: 1 }}>
            <Text size="2" weight="bold">
              {m.sender}
            </Text>
            {m.time && (
              <Text size="1" style={{ color: "var(--gray-8)" }}>
                {m.time}
              </Text>
            )}
          </Flex>
          {m.text && (
            <div style={{ wordBreak: "break-word", fontSize: 13 }}>
              {m.text}
            </div>
          )}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex style={{ width: "100%", paddingLeft: 40 }}>
      <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
        {m.text && (
          <div style={{ wordBreak: "break-word", fontSize: 13 }}>{m.text}</div>
        )}
      </Flex>
    </Flex>
  );
}

export function MockChat() {
  return (
    <Flex
      direction="column"
      style={{
        flex: 1,
        minWidth: 0,
        background: "var(--gray-3)",
        borderRadius: "var(--radius-5)",
        overflow: "hidden",
      }}
    >
      <Flex
        align="center"
        gap="2"
        px="3"
        py="2"
        style={{ flexShrink: 0, borderBottom: "1px solid var(--gray-5)" }}
      >
        <MdChat size={14} style={{ color: "var(--gray-9)" }} />
        <Text size="2" weight="bold">
          {ACTIVE_CHANNEL}
        </Text>
      </Flex>

      <Box style={{ flex: 1, overflow: "hidden", padding: "0 10px" }}>
        <Flex gap="1" mt="2">
          <ReactionBadge emoji="🔥" count={3} />
          <ReactionBadge emoji="👍" count={2} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              background: "var(--gray-3)",
              border: "1px solid var(--gray-5)",
              borderRadius: "var(--radius-2)",
              color: "var(--gray-10)",
              fontSize: 12,
              cursor: "default",
            }}
          >
            +
          </span>
        </Flex>

        {messages.map((m) => (
          <MessageRow key={m.id} m={m} />
        ))}
      </Box>

      <Box px="2" pb="2" style={{ flexShrink: 0 }}>
        <Flex
          align="center"
          gap="2"
          style={{
            background: "var(--gray-4)",
            borderRadius: "var(--radius-4)",
            padding: "6px 10px",
            border: "1px solid var(--gray-5)",
          }}
        >
          <MdAttachFile
            size={14}
            style={{ color: "var(--gray-9)", flexShrink: 0 }}
          />
          <MdInsertEmoticon
            size={14}
            style={{ color: "var(--gray-9)", flexShrink: 0 }}
          />
          <Text
            size="1"
            style={{ flex: 1, color: "var(--gray-8)", userSelect: "none" }}
          >
            Message #{ACTIVE_CHANNEL}
          </Text>
          <MdSend
            size={14}
            style={{ color: "var(--accent-9)", flexShrink: 0 }}
          />
        </Flex>
      </Box>
    </Flex>
  );
}
