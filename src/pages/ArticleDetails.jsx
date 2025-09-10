import React, { useState, useEffect } from 'react';
import { Article } from '@/api/entities';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

import ArticleHeader from '../components/article-details/ArticleHeader';
import ArticleMeta from '../components/article-details/ArticleMeta';
import ArticleContent from '../components/article-details/ArticleContent';
import ShareButtons from '../components/article-details/ShareButtons';
import AuthorBio from '../components/article-details/AuthorBio';
import ArticleSidebar from '../components/article-details/ArticleSidebar';
import RelatedArticles from '../components/article-details/RelatedArticles';
import CommentSection from '../components/article-details/CommentSection';

export default function ArticleDetailsPage() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticleData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const articleId = searchParams.get('id');

      if (!articleId) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedArticle = await Article.get(articleId);
        if (!fetchedArticle) {
          setIsLoading(false);
          return;
        }
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Hiba a cikk adatainak lekérése közben:", error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">A cikk nem található</h3>
        <p className="text-gray-600 mb-6">Lehet, hogy a cikket eltávolították, vagy hibás a link.</p>
        <Link to={createPageUrl('Blog')}>
          <Button variant="outline">Vissza a magazinhoz</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ArticleHeader article={article} />
            <ArticleMeta article={article} />
            <ArticleContent content={article.content} />
            <ShareButtons article={article} />
            
            {/* Mobile Sidebar Content */}
            <div className="lg:hidden space-y-8">
              <ArticleSidebar />
            </div>
            
            <AuthorBio author={article.author} />
            
            {/* Desktop: Smaller gap before comments */}
            <div className="hidden lg:block lg:mt-6">
              <CommentSection articleId={article.id} />
            </div>
            
            {/* Mobile: Normal gap before comments */}
            <div className="lg:hidden mt-8">
              <CommentSection articleId={article.id} />
            </div>
            
            <RelatedArticles currentArticle={article} />
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <ArticleSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}