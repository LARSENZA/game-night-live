"use client";

import { useEffect, useState } from "react";

const imageCache = new Map<string, string | null>();
const pending = new Map<string, Promise<string | null>>();

type WikiPage = {
  thumbnail?: { source?: string };
};

type CommonsPage = {
  imageinfo?: Array<{ thumburl?: string; url?: string }>;
};

async function resolveProduceImage(title: string): Promise<string | null> {
  if (imageCache.has(title)) return imageCache.get(title) ?? null;
  if (pending.has(title)) return pending.get(title) ?? null;

  const request = (async () => {
    try {
      const wikiParams = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        redirects: "1",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "900",
        pilicense: "free",
        titles: title,
      });
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?${wikiParams.toString()}`,
      );
      if (wikiResponse.ok) {
        const data = (await wikiResponse.json()) as {
          query?: { pages?: Record<string, WikiPage> };
        };
        const page = Object.values(data.query?.pages ?? {})[0];
        const source = page?.thumbnail?.source;
        if (source) {
          imageCache.set(title, source);
          return source;
        }
      }

      // Some produce pages have no PageImages thumbnail. Fall back to a
      // Wikimedia Commons file search so the game still shows a photograph.
      const commonsParams = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        generator: "search",
        gsrsearch: `file:${title} fruit vegetable food`,
        gsrnamespace: "6",
        gsrlimit: "8",
        prop: "imageinfo",
        iiprop: "url|mime",
        iiurlwidth: "900",
      });
      const commonsResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?${commonsParams.toString()}`,
      );
      if (commonsResponse.ok) {
        const data = (await commonsResponse.json()) as {
          query?: { pages?: Record<string, CommonsPage> };
        };
        const pages = Object.values(data.query?.pages ?? {});
        const source = pages
          .flatMap((page) => page.imageinfo ?? [])
          .map((info) => info.thumburl || info.url)
          .find((url): url is string => Boolean(url));
        if (source) {
          imageCache.set(title, source);
          return source;
        }
      }
    } catch {
      // The UI below gives the host a clean skip-card fallback.
    }
    imageCache.set(title, null);
    return null;
  })();

  pending.set(title, request);
  const result = await request;
  pending.delete(title);
  return result;
}

export function WikiProduceImage({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null | undefined>(() =>
    imageCache.has(title) ? imageCache.get(title) ?? null : undefined,
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active)
        setSrc(imageCache.has(title) ? imageCache.get(title) ?? null : undefined);
    });
    void resolveProduceImage(title).then((next) => {
      if (active) setSrc(next);
    });
    return () => {
      active = false;
    };
  }, [title]);

  if (src === undefined)
    return <div className="produce-image-placeholder">Loading photograph…</div>;
  if (!src)
    return <div className="produce-image-placeholder error">Photograph unavailable · skip this card</div>;

  return (
    <img
      className={className}
      src={src}
      alt="Produce item to identify"
      referrerPolicy="no-referrer"
    />
  );
}
