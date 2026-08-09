export type Track = {
  title: string;
  /** URL to an audio file (CDN asset, /public path, or remote https URL). */
  src: string;
};

/**
 * قائمة الموسيقى الخلفية.
 * أضف ملفات MP3 هنا (رفعها إلى المشروع) وسيتم تشغيلها تلقائياً بصوت منخفض.
 */
export const tracks: Track[] = [];
