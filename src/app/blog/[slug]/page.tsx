import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ahmed Ali`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#050508] text-white px-6 py-24">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="text-xs text-white/30 hover:text-gold transition-colors mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <header className="mb-12">
          <time className="text-xs text-white/30 font-mono block mb-3">
            {post.date} · {post.readingTime}
          </time>
          <h1 className="text-3xl font-light tracking-wider text-white/90 mb-4">
            {post.title}
          </h1>
          <p className="text-sm text-white/40">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-sm max-w-none
            prose-headings:font-light prose-headings:tracking-wider
            prose-p:text-white/60 prose-p:leading-relaxed
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-code:text-gold/80 prose-code:text-xs prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/5
            prose-strong:text-white/80
            prose-li:text-white/50
            prose-blockquote:border-gold/20 prose-blockquote:text-white/40"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
