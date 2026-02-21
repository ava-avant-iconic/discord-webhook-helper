/**
 * Discord Webhook Helper
 * Simple library for sending Discord webhook status messages with embeds
 */

import fetch from 'node-fetch';

// TypeScript types
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

export class DiscordWebhook {
  private webhookUrl: string;
  private username?: string;
  private avatarUrl?: string;
  private timeout: number;

  public static readonly STATUS_COLORS: Record<DiscordStatusColor, number> = {
    success: 0x57F287, // Green
    warning: 0xFEE75C, // Yellow
    error: 0xED4245,   // Red
    info: 0x5865F2,    // Blue
  };

  constructor(options: DiscordWebhookOptions) {
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
  async send(content: string, embeds?: DiscordEmbed[]): Promise<void> {
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
  async sendStatus(
    status: DiscordStatusColor,
    title: string,
    description?: string,
    fields?: DiscordEmbedField[],
    imageUrl?: string
  ): Promise<void> {
    const embed: DiscordEmbed = {
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
  createEmbed(): EmbedBuilder {
    return new EmbedBuilder();
  }

  /**
   * Send multiple embeds
   */
  async sendEmbeds(embeds: DiscordEmbed[]): Promise<void> {
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

  private async _execute(payload: DiscordWebhookPayload): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.webhookUrl, {
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
    } catch (error) {
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

/**
 * Embed builder for creating complex Discord embeds
 */
export class EmbedBuilder {
  private embed: DiscordEmbed = {};

  setTitle(title: string): EmbedBuilder {
    this.embed.title = title;
    return this;
  }

  setDescription(description: string): EmbedBuilder {
    this.embed.description = description;
    return this;
  }

  setColor(color: number): EmbedBuilder {
    this.embed.color = color;
    return this;
  }

  setStatusColor(status: DiscordStatusColor): EmbedBuilder {
    this.embed.color = DiscordWebhook.STATUS_COLORS[status];
    return this;
  }

  setUrl(url: string): EmbedBuilder {
    this.embed.url = url;
    return this;
  }

  setTimestamp(): EmbedBuilder {
    this.embed.timestamp = new Date().toISOString();
    return this;
  }

  setFooter(text: string, iconUrl?: string): EmbedBuilder {
    this.embed.footer = { text, icon_url: iconUrl };
    return this;
  }

  setImage(url: string): EmbedBuilder {
    this.embed.image = { url };
    return this;
  }

  setThumbnail(url: string): EmbedBuilder {
    this.embed.thumbnail = { url };
    return this;
  }

  addField(name: string, value: string, inline = false): EmbedBuilder {
    if (!this.embed.fields) {
      this.embed.fields = [];
    }
    this.embed.fields.push({ name, value, inline });
    return this;
  }

  addFields(fields: DiscordEmbedField[]): EmbedBuilder {
    if (!this.embed.fields) {
      this.embed.fields = [];
    }
    this.embed.fields.push(...fields);
    return this;
  }

  build(): DiscordEmbed {
    return this.embed;
  }
}

/**
 * Helper function to send a quick webhook message
 */
export async function sendWebhook(
  webhookUrl: string,
  content: string,
  options?: {
    username?: string;
    avatarUrl?: string;
    embeds?: DiscordEmbed[];
  }
): Promise<void> {
  const webhook = new DiscordWebhook({ webhookUrl, ...options });
  await webhook.send(content, options?.embeds);
}

/**
 * Helper function to send a quick status embed
 */
export async function sendStatus(
  webhookUrl: string,
  status: DiscordStatusColor,
  title: string,
  description?: string,
  options?: {
    username?: string;
    avatarUrl?: string;
    fields?: DiscordEmbedField[];
    imageUrl?: string;
  }
): Promise<void> {
  const webhook = new DiscordWebhook({
    webhookUrl,
    username: options?.username,
    avatarUrl: options?.avatarUrl,
  });
  await webhook.sendStatus(status, title, description, options?.fields, options?.imageUrl);
}

export default DiscordWebhook;
