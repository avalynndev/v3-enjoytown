"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type VideoSourceKey =
  | "vidora"
  | "embedsu"
  | "autoembed"
  | "vidsrc"
  | "superembed"
  | "twoembed"
  | "vidlink"
  | "videasy"
  | "onemovies"
  | "vidzee"
  | "vidzee4k";

export function MoviePlayer({ id }: { id: number }) {
  const [selectedSource, setSelectedSource] =
    useState<VideoSourceKey>("vidora");
  const [loading, setLoading] = useState(false);

  const videoSources: Record<VideoSourceKey, string> = {
    vidora: `https://vidora.su/movie/${id}?colour=141414&autoplay=true&autonextepisode=true`,
    embedsu: `https://embed.su/embed/movie/${id}`,
    autoembed: `https://player.autoembed.cc/embed/movie/${id}`,
    vidsrc: `https://vidsrc.in/embed/movie/${id}`,
    superembed: `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    twoembed: `https://www.2embed.cc/embed/${id}`,
    vidlink: `https://vidlink.pro/movie/${id}`,
    videasy: `https://player.videasy.net/movie/${id}`,
    onemovies: `https://111movies.com/movie/${id}`,
    vidzee: `https://vidzee.wtf/movie/${id}`,
    vidzee4k: `https://vidzee.wtf/movie/4k/${id}`,
  };

  const handleSelectChange = (value: VideoSourceKey) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedSource(value);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Select onValueChange={handleSelectChange} value={selectedSource}>
          <SelectTrigger className="w-[280px] rounded-md px-4 py-2">
            <SelectValue placeholder="Select Video Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vidora">Vidora</SelectItem>
            <SelectItem value="embedsu">EmbedSu</SelectItem>
            <SelectItem value="autoembed">AutoEmbed</SelectItem>
            <SelectItem value="vidsrc">VidSrc</SelectItem>
            <SelectItem value="superembed">SuperEmbed</SelectItem>
            <SelectItem value="twoembed">2Embed</SelectItem>
            <SelectItem value="vidlink">VidLink</SelectItem>
            <SelectItem value="videasy">Videasy</SelectItem>
            <SelectItem value="onemovies">111Movies</SelectItem>
            <SelectItem value="vidzee">Vidzee</SelectItem>
            <SelectItem value="vidzee4k">Vidzee 4K</SelectItem>
          </SelectContent>
        </Select>

        <Link href={`https://dl.vidsrc.vip/movie/${id}`} target="_blank">
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            <Download className="mr-1.5" size={12} />
            Download Movie
          </Badge>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-[500px] w-full rounded-xl border" />
      ) : (
        <iframe
          src={videoSources[selectedSource]}
          allowFullScreen
          width="100%"
          height="650"
          scrolling="no"
          className="w-full rounded-xl border shadow-sm"
        />
      )}
    </div>
  );
}
