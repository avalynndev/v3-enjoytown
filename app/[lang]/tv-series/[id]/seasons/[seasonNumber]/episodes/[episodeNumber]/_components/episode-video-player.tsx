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

type SourceKey =
  | "vidora"
  | "embedsu"
  | "vidsrc"
  | "superembed"
  | "twoembed"
  | "vidlink"
  | "videasy"
  | "onemovies"
  | "vidzee"
  | "vidzee4k";

export function EpisodeVideoPlayer({
  id,
  seasonNumber,
  episodeNumber,
}: {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
}) {
  const [selectedSource, setSelectedSource] = useState<SourceKey>("vidora");
  const [loading, setLoading] = useState(false);

  const tvSources: Record<SourceKey, string> = {
    vidora: `https://vidora.su/tv/${id}/${seasonNumber}/${episodeNumber}?colour=141414&autoplay=true&autonextepisode=true`,
    embedsu: `https://embed.su/embed/tv/${id}/${seasonNumber}/${episodeNumber}`,
    vidsrc: `https://vidsrc.in/embed/tv/${id}/${seasonNumber}/${episodeNumber}`,
    superembed: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`,
    twoembed: `https://www.2embed.cc/embedtv/${id}&s=${seasonNumber}&e=${episodeNumber}`,
    vidlink: `https://vidlink.pro/tv/${id}/${seasonNumber}/${episodeNumber}`,
    videasy: `https://player.videasy.net/tv/${id}/${seasonNumber}/${episodeNumber}`,
    onemovies: `https://111movies.com/tv/${id}/${seasonNumber}/${episodeNumber}`,
    vidzee: `https://vidzee.wtf/tv/${id}/${seasonNumber}/${episodeNumber}`,
    vidzee4k: `https://vidzee.wtf/tv/4k/${id}/${seasonNumber}/${episodeNumber}`,
  };

  const handleSelectChange = (value: SourceKey) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedSource(value);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pt-6 pb-10 px-4 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Select onValueChange={handleSelectChange} value={selectedSource}>
          <SelectTrigger className="w-[280px] rounded-md px-4 py-2">
            <SelectValue placeholder="Select Video Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vidora">Vidora</SelectItem>
            <SelectItem value="embedsu">EmbedSu</SelectItem>
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

        <Link
          href={`https://dl.vidsrc.vip/tv/${id}/${seasonNumber}/${episodeNumber}`}
          target="_blank"
        >
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            <Download className="mr-1.5" size={12} />
            Download S{seasonNumber}E{episodeNumber}
          </Badge>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-[500px] w-full rounded-xl border" />
      ) : (
        <iframe
          src={tvSources[selectedSource]}
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
