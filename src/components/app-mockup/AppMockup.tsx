import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import styles from "./AppMockup.module.css";
import type { MockAppState } from "./data";
import { channels as defaultChannels } from "./data";
import { MockChannelSidebar } from "./MockChannelSidebar";
import { MockChat } from "./MockChat";
import { MockMemberSidebar } from "./MockMemberSidebar";
import { MockServerRail } from "./MockServerRail";

export function AppMockup(props: MockAppState) {
  const chs = props.channels ?? defaultChannels;
  const defaultId = chs[0]?.id ?? "1";
  const [internalChannelId, setInternalChannelId] = useState(defaultId);

  const selectedChannelId = props.selectedChannelId ?? internalChannelId;
  const selectedChannel = chs.find((c) => c.id === selectedChannelId) ?? chs[0];

  return (
    <div className={styles.scaler}>
      <div className={styles.wrapper}>
        <Theme
          appearance="dark"
          accentColor="iris"
          grayColor="slate"
          radius="medium"
          scaling="95%"
          hasBackground
          panelBackground="solid"
          className={styles.theme}
        >
          <div className={styles.titlebar}>
            <div className={styles.navButtons}>
              <button className={styles.navBtn} tabIndex={-1}>
                <MdChevronLeft size={14} />
              </button>
              <button className={styles.navBtn} tabIndex={-1}>
                <MdChevronRight size={14} />
              </button>
            </div>
            <span className={styles.titlebarText}>gryt</span>
          </div>

          <div className={styles.layout}>
            <MockServerRail servers={props.servers} />

            <MockChannelSidebar
              selectedChannelId={selectedChannelId}
              onChannelClick={setInternalChannelId}
              channels={props.channels}
              sidebarItems={props.sidebarItems}
              voiceUsers={props.voiceUsers}
            />

            <MockChat
              channelName={selectedChannel?.name ?? "general"}
              channelType={selectedChannel?.type ?? "text"}
              messages={props.messages}
              visibleMessageCount={props.visibleMessageCount}
            />

            <MockMemberSidebar members={props.members} />
          </div>
        </Theme>
      </div>
    </div>
  );
}
