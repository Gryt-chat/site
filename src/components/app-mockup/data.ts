export const SERVER_NAME = "My Server";

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

export interface MockVoiceUser {
  nickname: string;
  color: string;
  channelId: string;
}

export interface MockServer {
  name: string;
  fallback: string;
  isActive: boolean;
  isConnected: boolean;
}

export interface MockAppState {
  servers?: MockServer[];
  channels?: MockChannel[];
  sidebarItems?: MockSidebarItem[];
  voiceUsers?: MockVoiceUser[];
  messages?: MockMessage[];
  members?: MockMember[];
  selectedChannelId?: string;
  visibleMessageCount?: number;
}

export const defaultServers: MockServer[] = [
  { name: "Gryt Server", fallback: "G", isActive: true, isConnected: true },
  { name: "Dev Team", fallback: "D", isActive: false, isConnected: false },
];

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

export const voiceUsers: MockVoiceUser[] = [
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
    time: "7:12 PM",
    text: "server is up and running, just finished the config",
    firstInGroup: true,
  },
  {
    id: "m2",
    sender: "Riley",
    color: "#56b6c2",
    time: "",
    text: "let me know if anything feels off",
    firstInGroup: false,
  },
  {
    id: "m3",
    sender: "Morgan",
    color: "#c678dd",
    time: "7:14 PM",
    text: "looks great, latency is super low",
    firstInGroup: true,
  },
  {
    id: "m4",
    sender: "Alex",
    color: "#6c63ff",
    time: "7:15 PM",
    text: "just joined the gaming channel, anyone wanna hop in?",
    firstInGroup: true,
  },
  {
    id: "m5",
    sender: "Jordan",
    color: "#e06c75",
    time: "7:16 PM",
    text: "omw",
    firstInGroup: true,
  },
  {
    id: "m6",
    sender: "Quinn",
    color: "#e5c07b",
    time: "7:16 PM",
    text: "same, give me a sec",
    firstInGroup: true,
  },
  {
    id: "m7",
    sender: "Casey",
    color: "#98c379",
    time: "7:20 PM",
    text: "the lounge is nice and quiet if anyone wants to chill",
    firstInGroup: true,
  },
  {
    id: "m8",
    sender: "Morgan",
    color: "#c678dd",
    time: "7:21 PM",
    text: "I'll join you in a bit, just finishing something",
    firstInGroup: true,
  },
  {
    id: "m9",
    sender: "Sage",
    color: "#61afef",
    time: "7:25 PM",
    text: "anyone got a good playlist going?",
    firstInGroup: true,
  },
  {
    id: "m10",
    sender: "River",
    color: "#4a9eff",
    time: "7:26 PM",
    text: "yeah hop into music, I've got something on",
    firstInGroup: true,
  },
  {
    id: "m11",
    sender: "Sage",
    color: "#61afef",
    time: "7:26 PM",
    text: "perfect",
    firstInGroup: true,
  },
  {
    id: "m12",
    sender: "Alex",
    color: "#6c63ff",
    time: "7:32 PM",
    text: "screen share is working perfectly btw",
    firstInGroup: true,
  },
  {
    id: "m13",
    sender: "Alex",
    color: "#6c63ff",
    time: "",
    text: "we're watching the finals in gaming if anyone wants to join",
    firstInGroup: false,
  },
  {
    id: "m14",
    sender: "Jordan",
    color: "#e06c75",
    time: "7:33 PM",
    text: "the quality is insane, feels like native",
    firstInGroup: true,
  },
  {
    id: "m15",
    sender: "Riley",
    color: "#56b6c2",
    time: "7:35 PM",
    text: "glad everything is working well",
    firstInGroup: true,
  },
  {
    id: "m16",
    sender: "Riley",
    color: "#56b6c2",
    time: "",
    text: "I set up the channels the way we talked about, feel free to rename stuff",
    firstInGroup: false,
  },
  {
    id: "m17",
    sender: "Casey",
    color: "#98c379",
    time: "7:38 PM",
    text: "this is way better than what we were using before",
    firstInGroup: true,
  },
  {
    id: "m18",
    sender: "Quinn",
    color: "#e5c07b",
    time: "7:40 PM",
    text: "honestly yeah, voice hasn't dropped once",
    firstInGroup: true,
  },
  {
    id: "m19",
    sender: "Morgan",
    color: "#c678dd",
    time: "7:42 PM",
    text: "ok I'm in the lounge now, come through whenever",
    firstInGroup: true,
  },
  {
    id: "m20",
    sender: "River",
    color: "#4a9eff",
    time: "7:45 PM",
    text: "yo who moved movie night to the bottom lol",
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
