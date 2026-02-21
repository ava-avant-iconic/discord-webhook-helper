"use strict";
/**
 * Discord Webhook Helper
 * Simple library for sending Discord webhook status messages with embeds
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedBuilder = exports.DiscordWebhook = void 0;
exports.sendWebhook = sendWebhook;
exports.sendStatus = sendStatus;
const node_fetch_1 = __importDefault(require("node-fetch"));
class DiscordWebhook {
    constructor(options) {
        if (!options.webhookUrl || !options.webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
            throw new Error('Invalid webhook URL. Must be a Discord webhook URL.');
        }
        this.webhookUrl = options.webhookUrl;
        this.username = options.username;
        this.avatarUrl = options.avatarUrl;
        this.timeout = options.timeout || 10000; // Default 10 seconds
    }
    /**
     * Send a message with optional embeds
     */
    async send(content, embeds) {
        await this._execute({
            content,
            username: this.username,
            avatar_url: this.avatarUrl,
            embeds,
        });
    }
    /**
     * Send a status embed with color
     */
    async sendStatus(status, title, description, fields, imageUrl) {
        const embed = {
            title,
            color: DiscordWebhook.STATUS_COLORS[status],
            timestamp: new Date().toISOString(),
        };
        if (description) {
            embed.description = description;
        }
        if (fields && fields.length > 0) {
            embed.fields = fields;
        }
        if (imageUrl) {
            embed.image = { url: imageUrl };
        }
        await this._execute({
            username: this.username,
            avatar_url: this.avatarUrl,
            embeds: [embed],
        });
    }
    /**
     * Create an embed builder for complex messages
     */
    createEmbed() {
        return new EmbedBuilder();
    }
    /**
     * Send multiple embeds
     */
    async sendEmbeds(embeds) {
        if (embeds.length === 0) {
            throw new Error('At least one embed is required');
        }
        if (embeds.length > 10) {
            throw new Error('Maximum 10 embeds allowed per message');
        }
        await this._execute({
            username: this.username,
            avatar_url: this.avatarUrl,
            embeds,
        });
    }
    async _execute(payload) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            const response = await (0, node_fetch_1.default)(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Discord API error: ${response.status} ${response.statusText} - ${errorText}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error(`Failed to send webhook: Request timeout after ${this.timeout}ms`);
                }
                throw new Error(`Failed to send webhook: ${error.message}`);
            }
            throw new Error('Failed to send webhook: Unknown error');
        }
    }
}
exports.DiscordWebhook = DiscordWebhook;
DiscordWebhook.STATUS_COLORS = {
    success: 0x57F287, // Green
    warning: 0xFEE75C, // Yellow
    error: 0xED4245, // Red
    info: 0x5865F2, // Blue
};
/**
 * Embed builder for creating complex Discord embeds
 */
class EmbedBuilder {
    constructor() {
        this.embed = {};
    }
    setTitle(title) {
        this.embed.title = title;
        return this;
    }
    setDescription(description) {
        this.embed.description = description;
        return this;
    }
    setColor(color) {
        this.embed.color = color;
        return this;
    }
    setStatusColor(status) {
        this.embed.color = DiscordWebhook.STATUS_COLORS[status];
        return this;
    }
    setUrl(url) {
        this.embed.url = url;
        return this;
    }
    setTimestamp() {
        this.embed.timestamp = new Date().toISOString();
        return this;
    }
    setFooter(text, iconUrl) {
        this.embed.footer = { text, icon_url: iconUrl };
        return this;
    }
    setImage(url) {
        this.embed.image = { url };
        return this;
    }
    setThumbnail(url) {
        this.embed.thumbnail = { url };
        return this;
    }
    addField(name, value, inline = false) {
        if (!this.embed.fields) {
            this.embed.fields = [];
        }
        this.embed.fields.push({ name, value, inline });
        return this;
    }
    addFields(fields) {
        if (!this.embed.fields) {
            this.embed.fields = [];
        }
        this.embed.fields.push(...fields);
        return this;
    }
    build() {
        return this.embed;
    }
}
exports.EmbedBuilder = EmbedBuilder;
/**
 * Helper function to send a quick webhook message
 */
async function sendWebhook(webhookUrl, content, options) {
    const webhook = new DiscordWebhook({ webhookUrl, ...options });
    await webhook.send(content, options?.embeds);
}
/**
 * Helper function to send a quick status embed
 */
async function sendStatus(webhookUrl, status, title, description, options) {
    const webhook = new DiscordWebhook({
        webhookUrl,
        username: options?.username,
        avatarUrl: options?.avatarUrl,
    });
    await webhook.sendStatus(status, title, description, options?.fields, options?.imageUrl);
}
exports.default = DiscordWebhook;
