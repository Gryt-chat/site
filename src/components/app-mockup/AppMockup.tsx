import "@radix-ui/themes/styles.css";

import { useCallback, useState } from "react";

import { Theme } from "@radix-ui/themes";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import styles from "./AppMockup.module.css";
import { channels } from "./data";
import { MockChannelSidebar } from "./MockChannelSidebar";
import { MockChat } from "./MockChat";
import { MockMemberSidebar } from "./MockMemberSidebar";
import { MockServerRail } from "./MockServerRail";

export function AppMockup() {
  const [selectedChannelId, setSelectedChannelId] = useState("1");

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  const handleChannelClick = useCallback((channelId: string) => {
    setSelectedChannelId(channelId);
  }, []);

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
              <span className={styles.navBtn}>
                <MdChevronLeft size={14} />
              </span>
              <span className={styles.navBtn}>
                <MdChevronRight size={14} />
              </span>
            </div>
            <span className={styles.titlebarText}>gryt.chat</span>
          </div>
          <div className={styles.layout}>
            <MockServerRail />
            <MockChannelSidebar
              selectedChannelId={selectedChannelId}
              onChannelClick={handleChannelClick}
            />
            <MockChat
              channelName={selectedChannel?.name ?? "general"}
              channelType={selectedChannel?.type ?? "text"}
            />
            <MockMemberSidebar />
          </div>
        </Theme>
      </div>
    </div>
  );
}
