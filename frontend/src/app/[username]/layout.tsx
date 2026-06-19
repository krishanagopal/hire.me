import type { Metadata, ResolvingMetadata } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = await params;
  
  try {
    const res = await fetch(`${BACKEND_URL}/profiles/${encodeURIComponent(username)}`, { cache: 'no-store' });
    const profile = await res.json();
    
    if (res.ok && profile) {
      const name = profile.fullName || profile.username;
      const headline = profile.headline || `${name}'s Professional Showcase on hire.me`;
      const description = profile.bio || `Explore the portfolio, projects, and resume of ${name}.`;
      // Use the profile banner, avatar, or default image for the card preview
      const ogImage = profile.bannerUrl || profile.avatarUrl || "/media__1781250813790.jpg";
      
      return {
        title: `${name} | hire.me`,
        description,
        openGraph: {
          title: `${name} | hire.me Showcase`,
          description,
          url: `https://hire.me/${username}`,
          siteName: 'hire.me',
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: `${name} Showcase Banner`,
            },
          ],
          type: 'profile',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${name} | hire.me Showcase`,
          description,
          images: [ogImage],
        },
      };
    }
  } catch (err) {
    console.error("Failed to fetch profile metadata:", err);
  }

  // Fallback metadata
  return {
    title: `${username} | hire.me`,
    description: "Professional Showcase on hire.me",
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
