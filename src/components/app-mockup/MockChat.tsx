import { useEffect, useRef, useState } from "react";

import { Avatar, Box, Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import { MdChat, MdVolumeUp } from "react-icons/md";

import type { MockMessage } from "./data";
import { messages as defaultMessages } from "./data";

const SPRING = { type: "spring" as const, stiffness: 170, damping: 26 };
const MIN_DELAY = 500;
const MAX_DELAY = 2000;

function randomDelay() {
  return MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
}

function MessageRow({ m, isNew }: { m: MockMessage; isNew: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <motion.div
      ref={ref}
      layout="position"
      style={{ width: "100%", overflow: isNew ? "hidden" : undefined }}
      initial={isNew ? { opacity: 0, height: 0 } : false}
      animate={{ opacity: 1, height: "auto" }}
      transition={{
        layout: SPRING,
        opacity: { duration: 0.2, ease: "easeOut" },
        height: SPRING,
      }}
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.overflow = "";
      }}
    >
      {content}
    </motion.div>
  );
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
  const controlled = visibleMessageCount !== undefined;
  const [autoCount, setAutoCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlled || messages.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    function scheduleNext(count: number) {
      if (count >= messages.length) return;
      timeout = setTimeout(() => {
        setPrevCount(count);
        setAutoCount(count + 1);
        scheduleNext(count + 1);
      }, randomDelay());
    }

    scheduleNext(0);
    return () => clearTimeout(timeout);
  }, [controlled, messages.length]);

  const currentCount = controlled ? visibleMessageCount : autoCount;

  useEffect(() => {
    if (controlled) setPrevCount((p) => Math.min(p, currentCount));
  }, [controlled, currentCount]);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const scroll = scrollRef.current;
    if (!content || !scroll) return;

    const observer = new ResizeObserver(() => {
      scroll.scrollTop = scroll.scrollHeight;
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const visible = messages.slice(0, currentCount);

  return (
    <Box
      overflow="hidden"
      flexGrow="1"
      minWidth="0"
      style={{
        background: "var(--gray-3)",
        borderRadius: "var(--radius-5)",
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
          ref={scrollRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            overflowX: "hidden",
            marginBottom: 12,
          }}
        >
          <div ref={contentRef}>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((m, i) => (
                <MessageRow key={m.id} m={m} isNew={i >= prevCount} />
              ))}
            </AnimatePresence>
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
