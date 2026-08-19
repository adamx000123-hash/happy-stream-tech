export type Track = {
  title: string;
  /** URL to an audio file served from the same deployment. */
  src: string;
};

/** قائمة الموسيقى الخلفية — الأولى هي التي تبدأ تلقائياً. */
export const tracks: Track[] = [
  { title: "Relaxing Piano", src: "/assets/relaxing-piano.mp3" },
  { title: "Relaxing Classical", src: "/assets/relaxing-classical.mp3" },
];
