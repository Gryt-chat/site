import {
  Avatar,
  Box,
  ContextMenu,
  Flex,
  IconButton,
  Slider,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { MdAlternateEmail, MdContentCopy, MdPushPin } from "react-icons/md";

import { type MockMember, members } from "./data";

const statusConfig = {
  in_voice: { label: "In Voice", color: "var(--accent-9)" },
  offline: { label: "Offline", color: "var(--gray-9)" },
} as const;

function MemberItem({ member }: { member: MockMember }) {
  const { label: statusLabel, color: statusColor } = statusConfig[member.status];
  const isOffline = member.status === "offline";

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          style={{
            background: "var(--gray-4)",
            borderRadius: "var(--radius-6)",
            padding: "8px 12px",
            cursor: "default",
          }}
        >
          <Flex align="center" gap="2" width="100%">
            <Avatar
              size="2"
              fallback={member.nickname[0]}
              style={{
                backgroundColor: member.color,
                opacity: isOffline ? 0.4 : 1,
                flexShrink: 0,
              }}
            />
            <Flex direction="column" style={{ flex: 1, minWidth: 0, gap: "1px" }}>
              <Text
                size="2"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: isOffline ? statusColor : undefined,
                }}
              >
                {member.nickname}
              </Text>
              <Text size="1" style={{ color: statusColor, lineHeight: 1.2 }}>
                {statusLabel}
              </Text>
            </Flex>
          </Flex>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        style={{ minWidth: 220 }}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ContextMenu.Label style={{ fontWeight: "bold" }}>
          {member.nickname}
        </ContextMenu.Label>
        <ContextMenu.Label>
          <Text size="1" color="gray" style={{ textTransform: "capitalize" }}>
            member
          </Text>
        </ContextMenu.Label>
        <ContextMenu.Item>
          <Flex align="center" gap="2">
            <MdAlternateEmail size={14} /> Mention
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Flex align="center" gap="2">
            <MdContentCopy size={14} /> Copy ID
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <Flex
          direction="column"
          gap="2"
          px="2"
          py="1"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Flex align="center" justify="between">
            <Text size="1" color="gray">
              Volume
            </Text>
            <Text
              size="1"
              weight="medium"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              100%
            </Text>
          </Flex>
          <Slider min={0} max={200} step={1} defaultValue={[100]} size="1" />
        </Flex>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export function MockMemberSidebar() {
  return (
    <Box
      style={{
        width: 155,
        flexShrink: 0,
        background: "var(--gray-3)",
        borderRadius: "var(--radius-5)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Flex direction="column" height="100%" p="3" gap="1">
        <Box pb="2">
          <Flex align="center" justify="between" gap="2">
            <Text size="2" weight="bold" color="gray">
              Members — {members.length}
            </Text>
            <Tooltip
              content="Unpin sidebar"
              delayDuration={200}
            >
              <IconButton size="1" variant="solid" color="gray">
                <MdPushPin size={14} />
              </IconButton>
            </Tooltip>
          </Flex>
        </Box>

        <Flex direction="column" gap="2" style={{ overflow: "auto", flex: 1 }}>
          {members.map((m) => (
            <MemberItem key={m.nickname} member={m} />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
