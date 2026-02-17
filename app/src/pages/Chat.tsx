import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    read: boolean | null;
    created_at: string | null;
    booking_id?: string | null;
}

interface UserProfile {
    full_name: string;
    profile_image?: string | null;
    auth_user_id: string;
}

export default function Chat() {
    const { userId: otherUserId } = useParams<{ userId: string }>();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking");
    const navigate = useNavigate();
    const { toast } = useToast();

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initChat();
    }, [otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const initChat = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate("/login"); return; }
            setCurrentUserId(user.id);

            if (!otherUserId) return;

            // Load the other user's profile
            const { data: profile } = await supabase
                .from("user_profiles")
                .select("full_name, profile_image, auth_user_id")
                .eq("auth_user_id", otherUserId)
                .single();

            setOtherUser(profile);

            // Load existing messages between the two users
            await loadMessages(user.id, otherUserId);

            // Mark received messages as read
            await supabase
                .from("messages")
                .update({ read: true, read_at: new Date().toISOString() })
                .eq("sender_id", otherUserId)
                .eq("receiver_id", user.id)
                .eq("read", false);

            // Subscribe to new messages in real time
            const channel = supabase
                .channel(`chat-${user.id}-${otherUserId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `receiver_id=eq.${user.id}`,
                    },
                    (payload) => {
                        const msg = payload.new as Message;
                        if (msg.sender_id === otherUserId) {
                            setMessages((prev) => [...prev, msg]);
                            // Mark as read immediately
                            supabase
                                .from("messages")
                                .update({ read: true, read_at: new Date().toISOString() })
                                .eq("id", msg.id);
                        }
                    }
                )
                .subscribe();

            setLoading(false);

            return () => { supabase.removeChannel(channel); };
        } catch (error: any) {
            console.error("Chat init error:", error);
            toast({ title: "Erro ao carregar chat", variant: "destructive" });
            setLoading(false);
        }
    };

    const loadMessages = async (myId: string, otherId: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .or(
                `and(sender_id.eq.${myId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${myId})`
            )
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Load messages error:", error);
        } else {
            setMessages(data || []);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !currentUserId || !otherUserId) return;
        setSending(true);

        const msgText = newMessage.trim();
        setNewMessage("");

        try {
            const { data, error } = await supabase
                .from("messages")
                .insert({
                    sender_id: currentUserId,
                    receiver_id: otherUserId,
                    message: msgText,
                    booking_id: bookingId || null,
                    read: false,
                })
                .select()
                .single();

            if (error) throw error;

            // Optimistically add to messages list
            setMessages((prev) => [...prev, data as Message]);
        } catch (error: any) {
            toast({
                title: "Erro ao enviar mensagem",
                description: error.message,
                variant: "destructive",
            });
            setNewMessage(msgText); // Restore the message
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateStr: string | null) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return format(date, "HH:mm");
        }
        return format(date, "dd/MM HH:mm", { locale: ptBR });
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    messages.forEach((msg) => {
        const dateStr = msg.created_at
            ? format(new Date(msg.created_at), "d 'de' MMMM", { locale: ptBR })
            : "Hoje";
        const last = groupedMessages[groupedMessages.length - 1];
        if (!last || last.date !== dateStr) {
            groupedMessages.push({ date: dateStr, messages: [msg] });
        } else {
            last.messages.push(msg);
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Chat Header */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b shadow-sm">
                <div className="container mx-auto px-4 max-w-2xl py-3 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {otherUser?.profile_image ? (
                            <img
                                src={otherUser.profile_image}
                                alt={otherUser.full_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 text-primary" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm truncate">
                            {otherUser?.full_name || "Usuário"}
                        </h2>
                        {bookingId && (
                            <p className="text-xs text-muted-foreground">
                                Conversa sobre reserva #{bookingId.slice(0, 8)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <main className="flex-1 pt-32 pb-24 overflow-y-auto">
                <div className="container mx-auto px-4 max-w-2xl space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">Nenhuma mensagem ainda.</p>
                            <p className="text-xs mt-1">Seja o primeiro a enviar uma mensagem!</p>
                        </div>
                    )}

                    {groupedMessages.map((group) => (
                        <div key={group.date}>
                            {/* Date separator */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground px-2">{group.date}</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Messages */}
                            <div className="space-y-2">
                                {group.messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUserId;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                                    isMe
                                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                                        : "bg-muted text-foreground rounded-bl-sm"
                                                }`}
                                            >
                                                <p className="break-words">{msg.message}</p>
                                                <p
                                                    className={`text-xs mt-1 text-right ${
                                                        isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {formatTime(msg.created_at)}
                                                    {isMe && (
                                                        <span className="ml-1">
                                                            {msg.read ? " ✓✓" : " ✓"}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 pb-safe">
                <div className="container mx-auto px-4 max-w-2xl py-3 flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua mensagem..."
                        className="flex-1"
                        disabled={sending}
                        autoFocus
                    />
                    <Button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        size="icon"
                        className="shrink-0"
                    >
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
