import {
  MicIcon,
  ChatIcon,
  VideoIcon,
  MultiServerIcon,
  GearIcon,
  PluginIcon,
} from "./icons";
import styles from "./Features.module.css";

const features = [
  {
    icon: <MicIcon />,
    title: "HD Voice Chat",
    desc: "WebRTC-powered voice with noise suppression, echo cancellation, and voice activity detection. Hear every word, not every keystroke.",
  },
  {
    icon: <ChatIcon />,
    title: "Text Channels",
    desc: "Persistent messaging with file uploads, image previews, and document sharing. Organized channels keep conversations focused.",
  },
  {
    icon: <VideoIcon />,
    title: "Video & Screen Sharing",
    desc: "Stream your camera or screen without artificial quality limits. The server admin decides the bitrate, not a paywall.",
  },
  {
    icon: <MultiServerIcon />,
    title: "Multi-Server",
    desc: "Connect to multiple self-hosted servers simultaneously and switch between them seamlessly. Your communities, your rules.",
  },
  {
    icon: <GearIcon />,
    title: "Fully Customizable",
    desc: "Configure file upload limits, stream bitrates, channels, roles, and more. Every server setting is in your hands.",
  },
  {
    icon: <PluginIcon />,
    title: "Plugin & Client SDK",
    desc: "Build your own client from scratch or develop plugins for the existing one. Gryt's extensible architecture welcomes creativity.",
  },
];

export function Features() {
  return (
    <section className="section border-top" id="features">
      <div className={styles.header}>
        <div>
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to connect.</h2>
          <p className="section-desc">
            Crystal-clear voice, real-time text, and video — all with
            professional-grade audio processing and zero paywalls.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {features.map((f) => (
          <div key={f.title} className={styles.card}>
            <div className={styles.icon}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
