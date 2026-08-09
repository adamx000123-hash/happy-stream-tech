export type Track = {
  title: string;
  /** URL to an audio file served from the same deployment. */
  src: string;
};

/** قائمة الموسيقى الخلفية. */
export const tracks: Track[] = [
  { title: "Relaxing Classical", src: "/assets/relaxing-classical.mp3" },
];
