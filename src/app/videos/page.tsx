"use client";

import { useState } from 'react';
import { videos } from '@/constants/content';
import { videosCopy } from '@/constants/uiCopy';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VideosPage() {
  const { language } = useLanguage();
  const copy = videosCopy[language];
  const items = videos[language];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-gray-500">{copy.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">{copy.upload}</h2>
          <p className="mt-2 text-sm text-gray-500">{copy.uploadHint}</p>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="mt-4"
          />
          {previewUrl && (
            <video className="mt-6 w-full rounded-2xl" controls>
              <source src={previewUrl} />
            </video>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {items.map((video) => (
            <div key={video.title} className="rounded-2xl bg-white p-4 shadow">
              <video className="w-full rounded-xl" controls preload="metadata">
                <source src={video.src} />
              </video>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{video.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{video.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
