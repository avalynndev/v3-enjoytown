"use client";

import { useEffect, useRef, useState } from "react";
import { APP_URL } from "@/constants";
import { Loader2 } from "lucide-react";

type ShizuruPlayerProps = {
  src: string | null;
  className?: string;
  autoPlay?: boolean;
};

export function ShizuruPlayer({ src, className, autoPlay = true }: ShizuruPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedProxy, setUsedProxy] = useState(false);

  const log = {
    info: (_msg: string, _data?: unknown) => {},
    error: (_msg: string, _data?: unknown) => {},
  };

  const getProxyBase = () => {
    const envProxy = process.env.PROXY_M3U8 ?? "";
    const localProxy = `${APP_URL}/api/proxy?url=`;
    return envProxy || localProxy;
  };

  useEffect(() => {
    if (!src) {
      setReady(false);
      setError(null);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setError(null);
    setReady(false);

    const ensureHls = async () => {
      if (typeof window === "undefined") return null;
      
      if ((window as any).Hls) {
        return (window as any).Hls as any;
      }

      return new Promise<any>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.14/dist/hls.min.js";
        script.async = true;
        script.onload = () => {
          resolve((window as any).Hls);
        };
        script.onerror = () => {
          reject(new Error("Failed to load hls.js"));
        };
        document.head.appendChild(script);
      });
    };

    let hls: any | null = null;
    let destroyed = false;

    const setupPlayer = async () => {
      try {
        const HlsCtor = await ensureHls();
        
        if (destroyed || !video) return;

        const canUseNative = video.canPlayType("application/vnd.apple.mpegurl") !== "";
        
        if (canUseNative) {
          const proxyBase = getProxyBase();
          const directUrl = src;
          const proxied = src.startsWith("http") ? `${proxyBase}${encodeURIComponent(src)}` : src;

          let triedProxy = false;

          const handleError = () => {
            if (!triedProxy) {
              triedProxy = true;
              setUsedProxy(true);
              log.error("Native HLS failed. Retrying with proxy", {
                directUrl,
                proxiedUrl: proxied,
              });
              video.src = proxied;
              video.load();
              video.play().catch(() => {});
            } else {
              log.error("Native HLS failed after proxy fallback", {
                directUrl,
                proxiedUrl: proxied,
              });
              setError("Failed to load stream");
              setIsLoading(false);
            }
          };

          video.addEventListener("error", handleError, { once: true });
          log.info("Native HLS: trying direct", { directUrl });
          video.src = directUrl;
          video.addEventListener("loadedmetadata", () => {
            if (!destroyed) {
              setReady(true);
              setIsLoading(false);
              if (autoPlay) {
                video.play().catch(() => {
                  setError("Unable to autoplay. Please click play manually.");
                });
              }
            }
          });
          video.play().catch(() => {});
        } else if (HlsCtor && HlsCtor.isSupported()) {
          const proxyBase = getProxyBase();
          hls = new HlsCtor({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });

          hls.on(HlsCtor.Events.MANIFEST_PARSED, () => {
            if (!destroyed) {
              setReady(true);
              setIsLoading(false);
              if (autoPlay) {
                video.play().catch(() => {
                  setError("Unable to autoplay. Please click play manually.");
                });
              }
            }
          });

          hls.on(HlsCtor.Events.ERROR, (event: any, data: any) => {
            if (!destroyed) {
              if (data.fatal) {
                switch (data.type) {
                  case HlsCtor.Events.ErrorTypes.NETWORK_ERROR:
                    if (!usedProxy) {
                      setUsedProxy(true);
                      try {
                        (hls as any).config.fetchSetup = (context: any, init: any) => {
                          const originalUrl: string = context.url;
                          const proxiedUrl = originalUrl.startsWith("http")
                            ? `${proxyBase}${encodeURIComponent(originalUrl)}`
                            : originalUrl;
                          log.info("hls.js fetch via proxy", { originalUrl, proxiedUrl });
                          return { url: proxiedUrl, init };
                        };
                        log.error("hls.js fatal NETWORK_ERROR. Retrying with proxy", {
                          source: src,
                        });
                        hls?.stopLoad();
                        hls?.detachMedia();
                        hls?.attachMedia(video);
                        hls?.loadSource(src);
                        hls?.startLoad();
                        return;
                      } catch {}
                    }
                    log.error("hls.js NETWORK_ERROR after proxy fallback", { source: src });
                    setError("Network error. Please check your connection.");
                    break;
                  case HlsCtor.Events.ErrorTypes.MEDIA_ERROR:
                    log.error("hls.js MEDIA_ERROR", data);
                    setError("Media error. Trying to recover...");
                    hls?.recoverMediaError();
                    break;
                  default:
                    log.error("hls.js fatal error", data);
                    setError("Failed to load stream");
                    hls?.destroy();
                    break;
                }
              }
            }
          });

          hls.attachMedia(video);
          log.info("hls.js: trying direct load", { src });
          hls.loadSource(src);
        } else {
          setError("HLS is not supported in this browser");
          setIsLoading(false);
        }
      } catch (err) {
        if (!destroyed) {
          setError("Failed to initialize player");
          setIsLoading(false);
        }
      }
    };

    setupPlayer();

    return () => {
      destroyed = true;
      setIsLoading(false);
      if (hls) {
        try {
          hls.destroy();
        } catch {
        }
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src, autoPlay]);

  return (
    <div className={className}>
      <div className="relative w-full aspect-video rounded-md bg-black overflow-hidden">
        <video
          ref={videoRef}
          controls
          playsInline
          className="w-full h-full"
          style={{ display: ready ? "block" : "none" }}
        />
        
        {(!src || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {!src ? "No channel selected" : "Loading stream..."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center p-4">
              <p className="text-sm text-destructive mb-2">{error}</p>
              {src && (
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    const video = videoRef.current;
                    if (video && src) {
                      video.load();
                      video.play().catch(() => {});
                    }
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

