"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Kanit, Sarabun } from 'next/font/google';
import { useLanguage } from '@/contexts/LanguageContext';
import { landingCopy } from '@/constants/landingCopy';
import { blogPosts, videos } from '@/constants/content';
import { siteLinks } from '@/constants/siteLinks';

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-kanit',
});

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-sarabun',
});

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const copy = landingCopy[language];
  const posts = blogPosts[language].slice(0, 2);
  const videoItems = videos[language].slice(0, 2);

  return (
    <main className={`${sarabun.className} min-h-screen bg-[#0f2b1b] text-white`}>
      <div className="relative overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#f3c45a]/20 blur-3xl" />
        <div className="absolute top-24 -right-32 h-96 w-96 rounded-full bg-[#e31b1b]/25 blur-3xl" />

        <header className="relative z-10 border-b border-[#d7b35d]/30 bg-[#12321f]/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7c16d] text-[#11301e]">
                <span className={`${kanit.className} text-lg font-bold`}>NZ</span>
              </div>
              <div className="leading-tight">
                <p className={`${kanit.className} text-lg font-bold`}>Nano Zinco</p>
                <p className="text-xs text-[#e7c16d]">Premium Zinc Supplement</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-[#f0e3c2] md:flex">
              <Link href="/" className="hover:text-white">{copy.nav.home}</Link>
              <Link href="/products" className="hover:text-white">{copy.nav.products}</Link>
              <a href="#benefits" className="hover:text-white">{copy.nav.benefits}</a>
              <a href="#testimonials" className="hover:text-white">{copy.nav.testimonials}</a>
              <a href="#blog" className="hover:text-white">{copy.nav.blog}</a>
              <a href="#videos" className="hover:text-white">{copy.nav.videos}</a>
              <Link href="/admin" className="hover:text-white">{copy.nav.admin}</Link>
              <a href="#contact" className="hover:text-white">{copy.nav.contact}</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1 rounded-full border border-[#f3c45a]/40 p-1 text-xs text-[#f6dd9a] md:flex">
                {(
                  [
                    { label: 'ไทย', value: 'th' },
                    { label: 'EN', value: 'en' },
                    { label: '中文', value: 'zh' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setLanguage(item.value)}
                    className={`rounded-full px-2.5 py-1 transition ${
                      language === item.value
                        ? 'bg-[#f3c45a] text-[#11301e]'
                        : 'text-[#f6dd9a] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <Link
                href="/login"
                className="rounded-full border border-[#f3c45a]/50 px-3 py-2 text-sm font-semibold text-[#f3c45a] transition hover:bg-[#f3c45a] hover:text-[#11301e]"
              >
                {copy.nav.login}
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-[#f3c45a] px-4 py-2 text-sm font-semibold text-[#f3c45a] transition hover:bg-[#f3c45a] hover:text-[#11301e]"
              >
                {copy.nav.buyNow}
              </Link>
            </div>
          </div>
        </header>

        <section className="hero-fade relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4b0b0b]/70 px-4 py-2 text-sm text-[#f6dd9a] ring-1 ring-[#f3c45a]/40">
              <span className="font-semibold">{copy.hero.badge}</span>
            </div>

            <h1 className={`${kanit.className} text-4xl font-extrabold leading-tight text-[#f9e4a7] md:text-5xl`}>
              {copy.hero.title}
            </h1>

            <p className="max-w-xl text-base text-[#e8d7b0] md:text-lg">
              {copy.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-[#e7c16d] px-8 py-3 text-lg font-bold text-[#4c1a0d] shadow-[0_10px_30px_rgba(231,193,109,0.45)] transition hover:-translate-y-0.5"
              >
                {copy.hero.ctaPrimary}
              </Link>
              <div className="rounded-full border border-[#f3c45a]/40 px-4 py-2 text-sm text-[#f4e1b8]">
                {copy.hero.ctaSecondary}
              </div>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {copy.benefits.items.slice(0, 3).map((text) => (
                <div
                  key={text}
                  className="rounded-2xl border border-[#f3c45a]/30 bg-[#1b3c26]/80 px-4 py-3 text-sm text-[#f1deb4]"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute bottom-6 h-10 w-64 rounded-full bg-[#000]/40 blur-2xl" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute -top-6 -right-6 rotate-6 rounded-full bg-[#e7c16d] px-4 py-2 text-sm font-bold text-[#4c1a0d] shadow-lg">
                  {copy.hero.tag}
                </div>
                <div className="rounded-[32px] border border-[#f3c45a]/40 bg-[#f1d38a]/10 p-6">
                  <Image
                    src="/landing/nanozinco_product_4.png"
                    alt="Nano Zinco product"
                    width={260}
                    height={360}
                    className="float-slow h-auto w-64"
                    priority
                  />
                </div>
              </div>
              <div className="rounded-full bg-[#f1d38a] px-10 py-3 text-xl font-extrabold text-[#4c1a0d] shadow-[0_12px_30px_rgba(241,211,138,0.45)]">
                {copy.hero.promo}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="product" className="bg-[#5b0f0f]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[#f3c45a]">
              {copy.product.saleLabel}
            </p>
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.product.title}
            </h2>
            <p className="text-[#f0d8a8]">{copy.product.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#e7c16d] px-6 py-2 text-sm font-semibold text-[#4c1a0d]"
              >
                {copy.nav.buyNow}
              </Link>
              <Link
                href="#coupon"
                className="rounded-full border border-[#f3c45a]/50 px-6 py-2 text-sm text-[#f4e1b8]"
              >
                {copy.coupon.title}
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-6 left-6">
              <Image
                src="/landing/pngtree-special-promo-red-label.png"
                alt="Promotion label"
                width={140}
                height={140}
                className="h-auto w-28"
              />
            </div>
            <div className="rounded-[28px] border border-[#f3c45a]/40 bg-[#7c1212] p-6">
              <Image
                src="/landing/nanozinco_product_4.png"
                alt="Nano Zinco bottle"
                width={280}
                height={380}
                className="h-auto w-64"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="bg-[#6f0f0f]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.benefits.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.benefits.items.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#f3c45a]/40 bg-[#891313] px-4 py-3 text-sm text-[#f5e3bb]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-[#f3c45a]/40 bg-[#7c1212] p-6">
            <h3 className={`${kanit.className} mb-4 text-2xl font-semibold text-white`}>
              {copy.testimonials.title}
            </h3>
            <div className="space-y-4">
              {copy.testimonials.items.map((review) => (
                <div key={review.name} className="rounded-2xl bg-white/95 p-4 text-[#4c1a0d]">
                  <p className="text-sm leading-relaxed">“{review.text}”</p>
                  <p className="mt-2 text-xs font-semibold text-[#7c1212]">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="bg-[#0f2b1b]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.showcase.title}
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {copy.showcase.items.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#f3c45a]/30 bg-[#1b3c26] p-6"
              >
                <h3 className={`${kanit.className} text-xl font-semibold text-white`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#e8d7b0]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-[#6f0f0f]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
            {copy.testimonials.title}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {copy.testimonials.items.map((review) => (
              <div key={review.name} className="rounded-3xl bg-white/95 p-6 text-[#4c1a0d]">
                <p className="text-sm leading-relaxed">“{review.text}”</p>
                <p className="mt-3 text-xs font-semibold text-[#7c1212]">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="buy" className="bg-gradient-to-b from-[#0f2b1b] to-[#0b2216]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.buyNow.title}
            </h2>
            <p className="text-[#e8d7b0]">{copy.buyNow.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#e7c16d] px-6 py-2 text-sm font-semibold text-[#4c1a0d]"
              >
                {copy.nav.buyNow}
              </Link>
              <Link
                href="/checkout"
                className="rounded-full border border-[#f3c45a]/50 px-6 py-2 text-sm text-[#f4e1b8]"
              >
                {copy.buyNow.cod}
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-[#f3c45a]/40 bg-[#12321f] p-5">
              <p className="text-sm text-[#f3c45a]">{copy.buyNow.bank}</p>
              <p className={`${kanit.className} mt-2 text-xl font-semibold text-white`}>KBANK</p>
              <p className="text-xs text-[#d7c49e]">XXX-X-XXXXX-X</p>
            </div>
            <div className="rounded-3xl border border-[#f3c45a]/40 bg-[#12321f] p-5">
              <p className="text-sm text-[#f3c45a]">{copy.buyNow.cod}</p>
              <p className={`${kanit.className} mt-2 text-xl font-semibold text-white`}>COD</p>
              <p className="text-xs text-[#d7c49e]">ชำระเงินปลายทางเมื่อรับสินค้า</p>
            </div>
          </div>
        </div>
      </section>

      <section id="coupon" className="bg-[#5b0f0f]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 md:flex-row md:justify-between">
          <div className="max-w-xl">
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.coupon.title}
            </h2>
            <p className="mt-3 text-[#e8d7b0]">{copy.coupon.description}</p>
          </div>
          <div className="rounded-3xl bg-[#f1d38a] px-8 py-6 text-center text-[#4c1a0d]">
            <p className="text-xs uppercase tracking-[0.2em]">{copy.coupon.note}</p>
            <p className={`${kanit.className} mt-2 text-3xl font-extrabold`}>{copy.coupon.code}</p>
          </div>
        </div>
      </section>

      <section id="app" className="bg-gradient-to-b from-[#0f2b1b] to-[#0b2216]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 md:flex-row md:justify-between">
          <div className="max-w-xl">
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.app.title}
            </h2>
            <p className="mt-3 text-[#e8d7b0]">{copy.app.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={siteLinks.appStoreUrl} target="_blank" rel="noreferrer">
              <Image
                src="/landing/app-store.png"
                alt="Download on the App Store"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <Link href={siteLinks.googlePlayUrl} target="_blank" rel="noreferrer">
              <Image
                src="/landing/google_play_logo.webp"
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <div className="rounded-2xl bg-[#e31b1b] px-5 py-3 text-sm font-semibold text-white shadow-lg">
              {copy.app.badge}
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-[#0f2b1b]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
                {copy.blog.title}
              </h2>
              <p className="mt-2 text-[#e8d7b0]">{copy.blog.subtitle}</p>
            </div>
            <Link href="/blog" className="text-sm text-[#f3c45a] hover:text-white">
              {copy.blog.cta}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog#${post.slug}`}
                className="rounded-3xl border border-[#f3c45a]/30 bg-[#1b3c26] p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#f3c45a]">{post.date}</p>
                <h3 className={`${kanit.className} mt-3 text-xl font-semibold text-white`}>
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-[#e8d7b0]">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="bg-[#6f0f0f]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
                {copy.videos.title}
              </h2>
              <p className="mt-2 text-[#f0d8a8]">{copy.videos.subtitle}</p>
            </div>
            <Link href="/videos" className="text-sm text-[#f3c45a] hover:text-white">
              {copy.videos.cta}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {videoItems.map((video) => (
              <div key={video.title} className="rounded-3xl bg-[#7c1212] p-4">
                <video className="w-full rounded-2xl" controls preload="metadata">
                  <source src={video.src} />
                </video>
                <h3 className={`${kanit.className} mt-4 text-lg font-semibold text-white`}>
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-[#f0d8a8]">{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="admin" className="bg-[#0f2b1b]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-12 md:flex-row md:justify-between">
          <div>
            <h2 className={`${kanit.className} text-3xl font-bold text-[#f9e4a7]`}>
              {copy.admin.title}
            </h2>
            <p className="mt-2 text-[#e8d7b0]">{copy.admin.description}</p>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-[#f3c45a]/50 px-6 py-2 text-sm text-[#f3c45a]"
          >
            {copy.nav.admin}
          </Link>
        </div>
      </section>

      <footer id="contact" className="bg-[#0b2216]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className={`${kanit.className} text-xl font-bold text-[#f9e4a7]`}>Nano Zinco</p>
            <p className="mt-2 text-sm text-[#d7c49e]">
              ผลิตภัณฑ์เสริมอาหารซิงค์คุณภาพสูง เพื่อคุณภาพชีวิตที่ดีกว่า
            </p>
          </div>
          <div className="text-sm text-[#d7c49e]">
            <p className="font-semibold text-white">{copy.contact.title}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href={siteLinks.callUrl} className="inline-flex items-center gap-2">
                <span className="text-[#f3c45a]">☎</span>
                <span>{copy.contact.call}</span>
              </a>
              <a href={siteLinks.facebookUrl} className="inline-flex items-center gap-2">
                <Image
                  src="/landing/facebook_logo.webp"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                <span>{copy.contact.facebook}</span>
              </a>
              <a href={siteLinks.lineUrl} className="inline-flex items-center gap-2">
                <Image
                  src="/landing/line_logo.webp"
                  alt="Line"
                  width={20}
                  height={20}
                />
                <span>{copy.contact.line}</span>
              </a>
              <a href={siteLinks.tiktokUrl} className="inline-flex items-center gap-2">
                <Image
                  src="/landing/tiktok-icon.png"
                  alt="TikTok"
                  width={20}
                  height={20}
                />
                <span>{copy.contact.tiktok}</span>
              </a>
            </div>
          </div>
          <div className="text-sm text-[#d7c49e]">
            <p className="font-semibold text-white">{copy.nav.buyNow}</p>
            <p className="mt-2">Line: @nanozinco</p>
            <p>Facebook: @nanozinco</p>
            <p>www.nanozinco.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
