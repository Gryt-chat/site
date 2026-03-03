import { Avatar, Box, Flex, IconButton } from "@radix-ui/themes";
import {
  MdAdd,
  MdCallEnd,
  MdMic,
  MdScreenShare,
  MdVolumeUp,
} from "react-icons/md";

export function MockServerRail() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="between"
      style={{ width: 48, flexShrink: 0, height: "100%" }}
    >
      <Flex direction="column" gap="3" align="center" pt="1">
        <Box position="relative">
          <Avatar
            size="2"
            radius="full"
            fallback="G"
            style={{ backgroundColor: "#6c63ff" }}
          />
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "var(--accent-9)",
              border: "2px solid var(--color-background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <MdMic size={7} color="var(--accent-contrast)" />
          </Box>
        </Box>

        <Avatar
          size="2"
          radius="full"
          fallback="D"
          color="gray"
          style={{ opacity: 0.4, filter: "grayscale(100%)" }}
        />

        <IconButton variant="soft" color="gray" size="2">
          <MdAdd size={14} />
        </IconButton>
      </Flex>

      <Flex direction="column" gap="1" align="center" pb="2">
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "var(--gray-a3)",
            borderRadius: 9999,
            padding: 2,
          }}
        >
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdMic size={12} />
          </IconButton>
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdVolumeUp size={12} />
          </IconButton>
          <IconButton size="2" color="gray" variant="soft" radius="full">
            <MdScreenShare size={12} />
          </IconButton>
          <IconButton size="2" color="red" variant="soft" radius="full">
            <MdCallEnd size={12} />
          </IconButton>
        </Box>
        <IconButton size="2" variant="ghost" style={{ marginTop: 4 }}>
          <Avatar size="1" fallback="A" style={{ backgroundColor: "#6c63ff" }} />
        </IconButton>
      </Flex>
    </Flex>
  );
}
