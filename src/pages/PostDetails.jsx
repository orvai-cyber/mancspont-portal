
import React, { useState, useEffect } from 'react';
import { Post } from '@/api/entities';
import { useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PostHeader from '../components/post-details/PostHeader';
import PostContent from '../components/post-details/PostContent';
import PostActions from '../components/post-details/PostActions';
import CommentSection from '../components/post-details/CommentSection';
import AuthorCard from '../components/post-details/AuthorCard';
import RelatedPosts from '../components/post-details/RelatedPosts';

export default function PostDetailsPage() {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const postId = searchParams.get('id');

      if (!postId) {
        setIsLoading(false);
        return;
      }

      try {
        const [fetchedPost, fetchedRelatedPosts] = await Promise.all([
          Post.get(postId),
          Post.list('-created_date', 4) // Fetch 3 related + the current one
        ]);

        if (!fetchedPost) {
          setIsLoading(false);
          return;
        }
        setPost(fetchedPost);
        setRelatedPosts(fetchedRelatedPosts.filter(p => p.id !== fetchedPost.id).slice(0, 3));

      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <Skeleton className="h-80 w-full rounded-2xl mb-8" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">A bejegyzés nem található</h3>
        <p className="text-gray-600 mb-6">Lehet, hogy a keresett bejegyzést törölték.</p>
        <Link to={createPageUrl('CommunityFeed')}>
          <Button variant="outline">Vissza a közösségi oldalra</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link to={createPageUrl('CommunityFeed')} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Vissza a közösséghez
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <main className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100">
                    <PostHeader post={post} />
                    <PostContent post={post} />
                    <PostActions post={post} />
                    <CommentSection />
                </main>
                <aside className="space-y-8">
                   <div className="sticky top-24 space-y-8">
                        <AuthorCard authorName={post.author_name} />
                        <RelatedPosts posts={relatedPosts} />
                   </div>
                </aside>
            </div>
        </div>
    </div>
  );
}
