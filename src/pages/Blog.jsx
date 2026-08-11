import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { posts } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Blog</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Study tips & exam guides</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Practical, no-fluff advice for JAMB, WAEC, NECO and POST-UTME candidates.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-card transition-shadow hover:shadow-glow"
            >
              <span className="mb-3 w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                {post.category}
              </span>
              <h2 className="mb-2 font-display text-lg font-bold text-ink">{post.title}</h2>
              <p className="mb-4 flex-1 text-sm text-muted">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary-600">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
