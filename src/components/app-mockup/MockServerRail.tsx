import {
  Avatar,
  Box,
  ContextMenu,
  DropdownMenu,
  Flex,
  Heading,
  HoverCard,
  IconButton,
  Tooltip,
} from "@radix-ui/themes";
import {
  MdAdd,
  MdCallEnd,
  MdFeedback,
  MdMic,
  MdScreenShare,
  MdSettings,
  MdVideocamOff,
  MdVolumeUp,
} from "react-icons/md";

function ServerAvatar({
  name,
  fallback,
  isActive,
  isConnected,
}: {
  name: string;
  fallback: string;
  isActive: boolean;
  isConnected: boolean;
}) {
  return (
    <HoverCard.Root openDelay={500} closeDelay={0}>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <HoverCard.Trigger>
            <Box position="relative">
              <Avatar
                size="2"
                color="gray"
                fallback={fallback}
                style={{
                  opacity: isActive ? 1 : 0.5,
                  cursor: "pointer",
                }}
              />
              {isConnected && (
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-9)",
                    border: "2px solid var(--color-background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <MdMic size={8} color="var(--accent-contrast)" />
                </Box>
              )}
            </Box>
          </HoverCard.Trigger>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label style={{ fontWeight: "bold" }}>
            {name}
          </ContextMenu.Label>
          <ContextMenu.Item>Edit</ContextMenu.Item>
          <ContextMenu.Item>Share</ContextMenu.Item>
          <ContextMenu.Item>Add to new group</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item color="red">Leave</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <HoverCard.Content maxWidth="300px" side="right" size="1" align="center">
        <Box>
          <Heading size="1">
            {name}
            {isConnected && (
              <span style={{ color: "var(--accent-9)", marginLeft: 8 }}>
                • Connected to voice
              </span>
            )}
          </Heading>
        </Box>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

export function MockServerRail() {
  return (
    <Flex
      direction="column"
      height="100%"
      gap="4"
      align="center"
      justify="between"
    >
      <Flex direction="column" gap="4" pt="2">
        <ServerAvatar
          name="Gryt Server"
          fallback="G"
          isActive
          isConnected
        />
        <ServerAvatar
          name="Dev Team"
          fallback="D"
          isActive={false}
          isConnected={false}
        />

        <Tooltip content="Add new server" delayDuration={100} side="right">
          <IconButton variant="soft" color="gray">
            <MdAdd size={16} />
          </IconButton>
        </Tooltip>
      </Flex>

      <Flex justify="center" align="center" direction="column" gap="3" pb="3">
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            background: "var(--gray-a3)",
            borderRadius: 9999,
            padding: 2,
          }}
        >
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdMic size={14} />
          </IconButton>
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdVolumeUp size={14} />
          </IconButton>
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdVideocamOff size={14} />
          </IconButton>
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdScreenShare size={14} />
          </IconButton>
          <IconButton size="2" color="red" variant="soft" radius="full">
            <MdCallEnd size={14} />
          </IconButton>
        </Box>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton size="2" variant="ghost">
              <Avatar
                size="1"
                fallback="A"
                style={{ backgroundColor: "#6c63ff" }}
              />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Flex align="center" gap="1">
                <MdSettings size={14} />
                Settings
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <Flex align="center" gap="1">
                <MdFeedback size={14} />
                Give feedback
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red">Sign out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
}
