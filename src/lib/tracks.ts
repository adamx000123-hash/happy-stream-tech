import relaxingClassical from "@/assets/relaxing-classical.mp3.asset.json";

export type Track = {
  title: string;
  /** URL to an audio file (CDN asset, /public path, or remote https URL). */
  src: string;
};

/** قائمة الموسيقى الخلفية. */
export const tracks: Track[] = [
  { title: "Relaxing Classical", src: relaxingClassical.url },
];
