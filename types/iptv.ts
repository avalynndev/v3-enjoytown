export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  country?: string;
  language?: string;
  isHD?: boolean;
  isGeoBlocked?: boolean;
  isYoutube?: boolean;
}

export interface IPTVChannelsResponse {
  channels: IPTVChannel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets?: {
    countries: string[];
    groups: string[];
  };
  cached?: boolean;
}

export interface IPTVPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentChannel: IPTVChannel | null;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  error: string | null;
}
