export const SERVER_NAME = "My Server";
export const ACTIVE_CHANNEL = "general";
export const ONLINE_BADGE = 7;

export interface MockChannel {
  id: string;
  name: string;
  type: "text" | "voice";
}

export interface MockSidebarItem {
  id: string;
  kind: "channel" | "separator";
  channelId?: string;
  label?: string;
}

export interface MockMessage {
  id: string;
  sender: string;
  color: string;
  time: string;
  text?: string;
  firstInGroup: boolean;
}

export interface MockMember {
  nickname: string;
  status: "in_voice" | "offline";
  color: string;
}

export const channels: MockChannel[] = [
  { id: "1", name: "general", type: "text" },
  { id: "2", name: "links", type: "text" },
  { id: "3", name: "clips", type: "text" },
  { id: "4", name: "Lounge 🎧", type: "voice" },
  { id: "5", name: "Gaming 🎮", type: "voice" },
  { id: "6", name: "Music 🎵", type: "voice" },
  { id: "7", name: "Movie Night 🍿", type: "voice" },
  { id: "8", name: "Chill Zone ☕", type: "voice" },
];

export const sidebarItems: MockSidebarItem[] = [
  { id: "s1", kind: "channel", channelId: "1" },
  { id: "s2", kind: "separator", label: "Media & Links" },
  { id: "s3", kind: "channel", channelId: "2" },
  { id: "s4", kind: "channel", channelId: "3" },
  { id: "s5", kind: "separator", label: "Voice Channels" },
  { id: "s6", kind: "channel", channelId: "4" },
  { id: "s7", kind: "channel", channelId: "5" },
  { id: "s8", kind: "channel", channelId: "6" },
  { id: "s9", kind: "channel", channelId: "7" },
  { id: "s10", kind: "channel", channelId: "8" },
];

export const voiceUsers = [
  { nickname: "Alex", color: "#6c63ff", channelId: "5" },
  { nickname: "Jordan", color: "#e06c75", channelId: "5" },
  { nickname: "Quinn", color: "#e5c07b", channelId: "5" },
  { nickname: "Casey", color: "#98c379", channelId: "4" },
  { nickname: "Morgan", color: "#c678dd", channelId: "4" },
  { nickname: "Sage", color: "#61afef", channelId: "6" },
  { nickname: "River", color: "#4a9eff", channelId: "6" },
];

export const messages: MockMessage[] = [
  {
    id: "m1",
    sender: "Riley",
    color: "#56b6c2",
    time: "8:41 PM",
    text: "just finished setting up the server, everything looks good so far",
    firstInGroup: true,
  },
  {
    id: "m2",
    sender: "Morgan",
    color: "#c678dd",
    time: "8:42 PM",
    text: "nice, voice quality is really clean",
    firstInGroup: true,
  },
  {
    id: "m3",
    sender: "Alex",
    color: "#6c63ff",
    time: "8:45 PM",
    text: "has anyone tried screen sharing yet? want to watch the tournament together",
    firstInGroup: true,
  },
  {
    id: "m4",
    sender: "Jordan",
    color: "#e06c75",
    time: "8:46 PM",
    text: "yeah it works great, hop into Gaming",
    firstInGroup: true,
  },
  {
    id: "m5",
    sender: "Jordan",
    color: "#e06c75",
    time: "",
    text: "we're already in there",
    firstInGroup: false,
  },
  {
    id: "m6",
    sender: "Casey",
    color: "#98c379",
    time: "8:48 PM",
    text: "on my way",
    firstInGroup: true,
  },
];

export const members: MockMember[] = [
  { nickname: "Alex", status: "in_voice", color: "#6c63ff" },
  { nickname: "Jordan", status: "in_voice", color: "#e06c75" },
  { nickname: "Quinn", status: "in_voice", color: "#e5c07b" },
  { nickname: "Casey", status: "in_voice", color: "#98c379" },
  { nickname: "Morgan", status: "in_voice", color: "#c678dd" },
  { nickname: "Sage", status: "in_voice", color: "#61afef" },
  { nickname: "River", status: "in_voice", color: "#4a9eff" },
  { nickname: "Riley", status: "offline", color: "#56b6c2" },
];
