/**
 * Discord Webhook Helper
 * Simple library for sending Discord webhook status messages with embeds
 */
export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
export interface DiscordEmbed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
    };
    image?: {
        url: string;
    };
    thumbnail?: {
        url: string;
    };
    fields?: DiscordEmbedField[];
}
export interface DiscordWebhookPayload {
    content?: string;
    username?: string;
    avatar_url?: string;
    embeds?: DiscordEmbed[];
}
export type DiscordStatusColor = 'success' | 'warning' | 'error' | 'info';
export interface DiscordWebhookOptions {
    webhookUrl: string;
    username?: string;
    avatarUrl?: string;
    timeout?: number;
}
export declare class DiscordWebhook {
    private webhookUrl;
    private username?;
    private avatarUrl?;
    private timeout;
    static readonly STATUS_COLORS: Record<DiscordStatusColor, number>;
    constructor(options: DiscordWebhookOptions);
    /**
     * Send a message with optional embeds
     */
    send(content: string, embeds?: DiscordEmbed[]): Promise<void>;
    /**
     * Send a status embed with color
     */
    sendStatus(status: DiscordStatusColor, title: string, description?: string, fields?: DiscordEmbedField[], imageUrl?: string): Promise<void>;
    /**
     * Create an embed builder for complex messages
     */
    createEmbed(): EmbedBuilder;
    /**
     * Send multiple embeds
     */
    sendEmbeds(embeds: DiscordEmbed[]): Promise<void>;
    private _execute;
}
/**
 * Embed builder for creating complex Discord embeds
 */
export declare class EmbedBuilder {
    private embed;
    setTitle(title: string): EmbedBuilder;
    setDescription(description: string): EmbedBuilder;
    setColor(color: number): EmbedBuilder;
    setStatusColor(status: DiscordStatusColor): EmbedBuilder;
    setUrl(url: string): EmbedBuilder;
    setTimestamp(): EmbedBuilder;
    setFooter(text: string, iconUrl?: string): EmbedBuilder;
    setImage(url: string): EmbedBuilder;
    setThumbnail(url: string): EmbedBuilder;
    addField(name: string, value: string, inline?: boolean): EmbedBuilder;
    addFields(fields: DiscordEmbedField[]): EmbedBuilder;
    build(): DiscordEmbed;
}
/**
 * Helper function to send a quick webhook message
 */
export declare function sendWebhook(webhookUrl: string, content: string, options?: {
    username?: string;
    avatarUrl?: string;
    embeds?: DiscordEmbed[];
}): Promise<void>;
/**
 * Helper function to send a quick status embed
 */
export declare function sendStatus(webhookUrl: string, status: DiscordStatusColor, title: string, description?: string, options?: {
    username?: string;
    avatarUrl?: string;
    fields?: DiscordEmbedField[];
    imageUrl?: string;
}): Promise<void>;
export default DiscordWebhook;
//# sourceMappingURL=index.d.ts.map