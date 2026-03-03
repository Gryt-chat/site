import { Avatar, Badge, Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import { MdChat, MdVolumeUp } from "react-icons/md";

import {
  ACTIVE_CHANNEL,
  channels,
  ONLINE_BADGE,
  SERVER_NAME,
  sidebarItems,
  voiceUsers,
} from "./data";

const channelMap = new Map(channels.map((c) => [c.id, c]));

function SeparatorRow({ label }: { label?: string }) {
  return (
    <Flex width="100%" align="center" gap="2">
      <Box
        style={{ height: 1, background: "var(--gray-6)", flex: 1, opacity: 0.7 }}
      />
      {label && (
        <Text size="1" color="gray">
          {label}
        </Text>
      )}
      <Box
        style={{ height: 1, background: "var(--gray-6)", flex: 1, opacity: 0.7 }}
      />
    </Flex>
  );
}

function ChannelRow({ channelId }: { channelId: string }) {
  const ch = channelMap.get(channelId);
  if (!ch) return null;

  const isActive = ch.name === ACTIVE_CHANNEL;
  const usersInChannel = voiceUsers.filter((u) => u.channelId === channelId);

  return (
    <Flex direction="column" width="100%">
      <Button
        variant={isActive ? "solid" : "soft"}
        radius="large"
        size="1"
        style={{
          width: "100%",
          justifyContent: "start",
          overflow: "hidden",
        }}
      >
        <Flex align="center" style={{ flexShrink: 0 }}>
          {ch.type === "voice" ? (
            <MdVolumeUp size={14} />
          ) : (
            <MdChat size={14} />
          )}
        </Flex>
        <Text
          truncate
          size="1"
          style={{ flex: 1, minWidth: 0, textAlign: "left", display: "block" }}
        >
          {ch.name}
        </Text>
      </Button>

      {usersInChannel.length > 0 && (
        <Flex
          width="100%"
          pt="1"
          direction="column"
          style={{
            background: "var(--gray-3)",
            borderRadius: "0 0 var(--radius-5) var(--radius-5)",
          }}
        >
          {usersInChannel.map((u) => (
            <Flex
              key={u.nickname}
              gap="2"
              align="center"
              px="3"
              py="1"
              width="100%"
            >
              <Avatar
                radius="full"
                size="1"
                fallback={u.nickname[0]}
                style={{
                  flexShrink: 0,
                  backgroundColor: u.color,
                }}
              />
              <Text size="1" truncate>
                {u.nickname}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export function MockChannelSidebar() {
  return (
    <Flex
      direction="column"
      gap="2"
      style={{ width: 170, flexShrink: 0, overflow: "hidden" }}
    >
      <Card style={{ width: "100%", flexShrink: 0 }}>
        <Flex justify="between" align="center">
          <Text size="2">{SERVER_NAME}</Text>
          <Flex align="center" gap="1">
            <Badge color="green" variant="solid" size="1" radius="full">
              {ONLINE_BADGE}
            </Badge>
            <Text size="1" color="gray">
              ▾
            </Text>
          </Flex>
        </Flex>
      </Card>

      <Flex
        direction="column"
        gap="2"
        px="2"
        style={{ flex: 1, overflow: "hidden" }}
      >
        {sidebarItems.map((item) =>
          item.kind === "separator" ? (
            <SeparatorRow key={item.id} label={item.label} />
          ) : (
            <ChannelRow key={item.id} channelId={item.channelId ?? item.id} />
          ),
        )}
      </Flex>
    </Flex>
  );
}
