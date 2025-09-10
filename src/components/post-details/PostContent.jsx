import React from 'react';

export default function PostContent({ post }) {
    return (
        <article className="prose lg:prose-lg max-w-none text-gray-700">
            {post.photos && post.photos.length > 0 && (
                <div className="my-8">
                    <img src={post.photos[0]} alt={post.title} className="rounded-2xl shadow-lg w-full" />
                </div>
            )}
            {/* Using a simple div to render content; for markdown, use a library like react-markdown */}
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </article>
    );
}