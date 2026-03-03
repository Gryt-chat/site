import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";

import styles from "./AppMockup.module.css";
import { MockChannelSidebar } from "./MockChannelSidebar";
import { MockChat } from "./MockChat";
import { MockMemberSidebar } from "./MockMemberSidebar";
import { MockServerRail } from "./MockServerRail";

export function AppMockup() {
  return (
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
          <span className={styles.titlebarText}>gryt.chat</span>
          <div className={styles.windowControls}>
            <span className={styles.windowBtn}>─</span>
            <span className={styles.windowBtn}>□</span>
            <span className={styles.windowBtn}>×</span>
          </div>
        </div>
        <div className={styles.layout}>
          <MockServerRail />
          <MockChannelSidebar />
          <MockChat />
          <MockMemberSidebar />
        </div>
      </Theme>
    </div>
  );
}
