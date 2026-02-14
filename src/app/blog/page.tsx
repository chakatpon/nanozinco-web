"use client";

import { blogPosts } from '@/constants/content';
import { blogCopy } from '@/constants/uiCopy';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogPage() {
  const { language } = useLanguage();
  const copy = blogCopy[language];
  const posts = blogPosts[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-gray-500">{copy.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            id={post.slug}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">{post.date}</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
          </article>
        ))}
      </main>
    </div>
  );
}
