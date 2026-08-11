import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getPostBySlug, posts } from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <Link to="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="mb-4 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
          {post.category}
        </span>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>
      </motion.div>

      <div className="mt-10 space-y-5">
        {post.content.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="text-[15px] leading-relaxed text-ink/80"
          >
            {para}
          </motion.p>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-primary-100 pt-10">
          <h3 className="mb-5 font-display text-lg font-bold text-ink">More from the blog</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="rounded-xl border border-primary-100 bg-white p-4 shadow-card transition-shadow hover:shadow-glow"
              >
                <p className="font-display text-sm font-bold text-ink">{p.title}</p>
                <p className="mt-1 text-xs text-muted">{p.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
