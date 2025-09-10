
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const categoryLabels = {
    allattartas: 'Állattartás',
    neveles: 'Nevelés',
    egeszseg: 'Egészség',
    jogi_tudnivalok: 'Jogi tudnivalók',
    orokbefogadas: 'Örökbefogadás',
    tippek: 'Tippek & Trükkök'
};

const ArticleCard = ({ article }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group"
  >
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white h-full flex flex-col">
      <img 
        src={article.featured_image}
        alt={article.title}
        className="h-56 w-full object-cover"
      />
      <CardContent className="p-6 flex-grow flex flex-col">
        <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit mb-3">
          {categoryLabels[article.category] || article.category}
        </Badge>
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.read_time} perc olvasás</span>
          </div>
          <Link 
            to={createPageUrl(`ArticleDetails?id=${article.id}`)}
            className="font-semibold text-green-600 hover:text-green-800"
          >
            Tovább <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ArticleCardSkeleton = () => (
  <Card className="rounded-2xl shadow-lg border-0 h-full flex flex-col">
    <Skeleton className="h-56 w-full" />
    <CardContent className="p-6 flex-grow flex flex-col">
      <Skeleton className="h-6 w-24 rounded-full mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-5 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default function LatestArticles({ articles, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isLoading 
        ? Array(3).fill(0).map((_, i) => <ArticleCardSkeleton key={i} />)
        : articles.map(article => <ArticleCard key={article.id} article={article} />)
      }
    </div>
  );
}
