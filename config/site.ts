import {
  IconSettings,
  IconUsers,
  IconDeviceTvOld,
  IconClock,
  IconHeart,
  IconList,
  IconAntenna,
  IconUser,
  IconDeviceTv,
} from "@tabler/icons-react";

export const siteConfig = {
  name: "Enjoytown",
  url: "https://enjoytown.pro",
  ogImage: "",
  description: "c",
  links: {
    github: "https://github.com/avalynndev/enjoytown",
    twitter: "https://twitter.com/avalynndev",
  },
  navMain: [
    {
      title: "Movies",
      url: "/movies",
      icon: IconDeviceTvOld,
    },
    {
      title: "Tv Series",
      url: "/tv-series",
      icon: IconDeviceTvOld,
    },
    {
      title: "Doramas",
      url: "/doramas",
      icon: IconDeviceTvOld,
    },
    {
      title: "Anime",
      url: "/anime",
      icon: IconAntenna,
    },
    {
      title: "Live TV",
      url: "/iptv",
      icon: IconDeviceTv,
    },
  ],
  navClouds: [
    {
      title: "List",
      icon: IconList,
      isActive: true,
      items: [
        {
          title: "Movie/TV",
          url: "/list/mtv",
        },
        {
          title: "Anime",
          url: "/list/anime",
        },
      ],
    },
    {
      title: "Partners",
      icon: IconUsers,
      isActive: true,
      items: [
        {
          title: "1Anime",
          url: "https://1anime.app/",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/user/profile",
      icon: IconUser,
    },
    {
      title: "History",
      url: "/history",
      icon: IconClock,
    },
    {
      title: "Watchlist",
      url: "/watchlist",
      icon: IconHeart,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};
