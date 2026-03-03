import {
  Avatar,
  Box,
  Button,
  Card,
  ContextMenu,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { MdChat, MdPushPin, MdVolumeUp } from "react-icons/md";

import type { MockChannel, MockSidebarItem, MockVoiceUser } from "./data";
import {
  channels as defaultChannels,
  SERVER_NAME,
  sidebarItems as defaultSidebarItems,
  voiceUsers as defaultVoiceUsers,
} from "./data";

function SeparatorRow({ label }: { label?: string }) {
  return (
    <Flex width="100%" position="relative" align="center" gap="2">
      <Box
        style={{
          height: 1,
          background: "var(--gray-6)",
          flex: 1,
          opacity: 0.7,
        }}
      />
      {label && (
        <Text size="1" color="gray">
          {label}
        </Text>
      )}
      <Box
        style={{
          height: 1,
          background: "var(--gray-6)",
          flex: 1,
          opacity: 0.7,
        }}
      />
    </Flex>
  );
}

function ChannelRow({
  channelId,
  isSelected,
  onClick,
  channelMap,
  voiceUsers,
}: {
  channelId: string;
  isSelected: boolean;
  onClick: () => void;
  channelMap: Map<string, MockChannel>;
  voiceUsers: MockVoiceUser[];
}) {
  const ch = channelMap.get(channelId);
  if (!ch) return null;

  const usersInChannel = voiceUsers.filter((u) => u.channelId === channelId);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Flex direction="column" align="start" width="100%">
          <Button
            variant={isSelected ? "solid" : "soft"}
            radius="large"
            style={{
              width: "100%",
              justifyContent: "start",
              overflow: "hidden",
            }}
            onClick={onClick}
          >
            <Flex align="center" style={{ flexShrink: 0 }}>
              {ch.type === "voice" ? (
                <MdVolumeUp size={16} />
              ) : (
                <MdChat size={16} />
              )}
            </Flex>
            <Text
              truncate
              style={{
                flex: 1,
                minWidth: 0,
                textAlign: "left",
                display: "block",
              }}
            >
              {ch.name}
            </Text>
          </Button>

          {usersInChannel.length > 0 && (
            <Flex
              width="100%"
              pt="2"
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
                  py="2"
                  width="100%"
                >
                  <Avatar
                    radius="full"
                    size="1"
                    fallback={u.nickname[0]}
                    style={{ flexShrink: 0, backgroundColor: u.color }}
                  />
                  <Text size="2" truncate style={{ whiteSpace: "nowrap" }}>
                    {u.nickname}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label style={{ fontWeight: "bold" }}>
          {ch.name}
        </ContextMenu.Label>
        <ContextMenu.Item>Edit</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Move up</ContextMenu.Item>
        <ContextMenu.Item>Move down</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item color="red">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

interface MockChannelSidebarProps {
  selectedChannelId: string;
  onChannelClick: (channelId: string) => void;
  channels?: MockChannel[];
  sidebarItems?: MockSidebarItem[];
  voiceUsers?: MockVoiceUser[];
  serverName?: string;
}

export function MockChannelSidebar({
  selectedChannelId,
  onChannelClick,
  channels = defaultChannels,
  sidebarItems = defaultSidebarItems,
  voiceUsers = defaultVoiceUsers,
  serverName = SERVER_NAME,
}: MockChannelSidebarProps) {
  const channelMap = new Map(channels.map((c) => [c.id, c]));

  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      align="center"
      gap="4"
      style={{ width: 170, flexShrink: 0, overflow: "hidden" }}
    >
      <Card style={{ width: "100%", flexShrink: 0 }}>
        <Flex justify="between" align="center">
          <Text>{serverName}</Text>
          <Flex align="center" gap="2">
            <Tooltip content="Pin sidebar" delayDuration={200}>
              <IconButton size="1" variant="solid" color="gray">
                <MdPushPin size={14} />
              </IconButton>
            </Tooltip>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" size="1" color="gray">
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Server settings</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red">Leave</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </Card>

      <Box
        style={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Flex direction="column" gap="3" align="center" width="100%">
          {sidebarItems.map((item) =>
            item.kind === "separator" ? (
              <SeparatorRow key={item.id} label={item.label} />
            ) : (
              <ChannelRow
                key={item.id}
                channelId={item.channelId ?? item.id}
                isSelected={
                  (item.channelId ?? item.id) === selectedChannelId
                }
                onClick={() => onChannelClick(item.channelId ?? item.id)}
                channelMap={channelMap}
                voiceUsers={voiceUsers}
              />
            ),
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
