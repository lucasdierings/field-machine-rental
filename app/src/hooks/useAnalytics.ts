import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tracks page views and user events automatically.
 * Place <AnalyticsTracker /> once inside BrowserRouter + AuthProvider.
 */
export function useAnalyticsTracker() {
    const location = useLocation();
    const lastPath = useRef<string>("");

    useEffect(() => {
        // Avoid duplicate tracking on same path
        if (location.pathname === lastPath.current) return;
        lastPath.current = location.pathname;

        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);
}

async function trackPageView(pageUrl: string) {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        await supabase.from("analytics").insert({
            event_type: "page_view",
            page_url: pageUrl,
            user_id: session?.user?.id || null,
            user_agent: navigator.userAgent,
            session_id: getSessionId(),
            metadata: {
                referrer: document.referrer || null,
                screen: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                platform: getPlatform(),
            },
        });
    } catch {
        // Silent fail — analytics should never break the app
    }
}

export async function trackEvent(
    eventType: string,
    metadata?: Record<string, any>,
    searchQuery?: string,
) {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        await supabase.from("analytics").insert({
            event_type: eventType,
            page_url: window.location.pathname,
            search_query: searchQuery || null,
            user_id: session?.user?.id || null,
            user_agent: navigator.userAgent,
            session_id: getSessionId(),
            metadata: metadata || null,
        });
    } catch {
        // Silent fail
    }
}

function getSessionId(): string {
    const key = "fm_session_id";
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
}

function getPlatform(): string {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Android/.test(ua)) return "Android";
    if (/Mac/.test(ua)) return "macOS";
    if (/Win/.test(ua)) return "Windows";
    if (/Linux/.test(ua)) return "Linux";
    return "Other";
}
