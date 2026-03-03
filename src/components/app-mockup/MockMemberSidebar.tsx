import { Avatar, Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { MdPushPin } from "react-icons/md";

import { members } from "./data";

const statusConfig = {
  in_voice: { label: "In Voice", color: "var(--accent-9)" },
  offline: { label: "Offline", color: "var(--gray-9)" },
} as const;

export function MockMemberSidebar() {
  return (
    <Flex
      direction="column"
      p="2"
      gap="1"
      style={{
        width: 155,
        flexShrink: 0,
        background: "var(--gray-3)",
        borderRadius: "var(--radius-5)",
        overflow: "hidden",
      }}
    >
      <Box pb="1">
        <Flex align="center" justify="between" gap="1">
          <Text size="1" weight="bold" color="gray">
            Members — {members.length}
          </Text>
          <IconButton size="1" variant="soft" color="gray">
            <MdPushPin size={12} />
          </IconButton>
        </Flex>
      </Box>

      <Flex
        direction="column"
        gap="1"
        style={{ overflow: "hidden", flex: 1 }}
      >
        {members.map((m) => {
          const { label, color } = statusConfig[m.status];
          const isOffline = m.status === "offline";
          return (
            <div
              key={m.nickname}
              style={{
                background: "var(--gray-4)",
                borderRadius: "var(--radius-4)",
                padding: "6px 8px",
              }}
            >
              <Flex align="center" gap="2" width="100%">
                <Avatar
                  size="1"
                  fallback={m.nickname[0]}
                  style={{
                    backgroundColor: m.color,
                    opacity: isOffline ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                />
                <Flex
                  direction="column"
                  style={{ flex: 1, minWidth: 0, gap: 1 }}
                >
                  <Text
                    size="1"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: isOffline ? "var(--gray-9)" : undefined,
                    }}
                  >
                    {m.nickname}
                  </Text>
                  <Text size="1" style={{ color, lineHeight: 1, fontSize: 10 }}>
                    {label}
                  </Text>
                </Flex>
              </Flex>
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
}
