import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const StoryCard = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group"
  >
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white h-full flex flex-col">
      {post.photos && post.photos.length > 0 && (
        <img 
          src={post.photos[0]}
          alt={post.title}
          className="h-48 w-full object-cover"
        />
      )}
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
            <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author_name}</p>
            <p className="text-sm text-gray-500">Boldog gazdi</p>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">{post.title}</h3>
        <p className="text-gray-600 mb-4 text-sm">
          {`"${post.content.substring(0, 100)}..."`}
        </p>
        <Link 
          to={createPageUrl(`PostDetails?id=${post.id}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mt-auto"
        >
          Teljes történet <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);

const StoryCardSkeleton = () => (
  <Card className="rounded-2xl shadow-lg border-0 h-full flex flex-col">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-6 flex-grow flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-24 mt-auto" />
    </CardContent>
  </Card>
);

export default function CommunityStories({ posts, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading 
        ? Array(4).fill(0).map((_, i) => <StoryCardSkeleton key={i} />)
        : posts.map(post => <StoryCard key={post.id} post={post} />)
      }
    </div>
  );
}