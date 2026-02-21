# Discord Webhook Helper

Simple Node.js library for sending Discord webhook status messages with embeds. Features easy embed builder, status colors, GIF/image support, and comprehensive error handling.

## Features

- ✅ **Easy Embed Builder** - Fluent API for creating complex Discord embeds
- ✅ **Status Colors** - Predefined colors for success, warning, error, and info
- ✅ **GIF/Image Support** - Add images and GIFs to embeds
- ✅ **Error Handling** - Clear error messages and validation
- ✅ **TypeScript Types** - Full TypeScript support with type definitions
- ✅ **Zero Dependencies** - Only `node-fetch` for HTTP requests
- ✅ **Simple API** - Quick helper functions for common use cases

## Installation

```bash
npm install discord-webhook-helper
```

## Quick Start

### Send a Simple Message

```javascript
const { sendWebhook } = require('discord-webhook-helper');

await sendWebhook(
  'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL',
  '✅ Deployment successful!'
);
```

### Send a Status Embed

```javascript
const { sendStatus } = require('discord-webhook-helper');

await sendStatus(
  'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL',
  'success',
  'System Healthy',
  'All services are running normally',
  {
    fields: [
      { name: 'Uptime', value: '99.9%', inline: true },
      { name: 'Requests', value: '1,234', inline: true },
    ]
  }
);
```

## API Reference

### DiscordWebhook Class

Main class for sending Discord webhooks with customizable options.

```javascript
const { DiscordWebhook } = require('discord-webhook-helper');

const webhook = new DiscordWebhook({
  webhookUrl: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL',
  username: 'My Bot',
  avatarUrl: 'https://example.com/avatar.png',
  timeout: 10000, // milliseconds
});
```

#### Methods

**`send(content, embeds?)`** - Send a message with optional embeds

```javascript
await webhook.send('Hello, Discord!', [
  {
    title: 'Greeting',
    description: 'This is a test message'
  }
]);
```

**`sendStatus(status, title, description?, fields?, imageUrl?)`** - Send a status embed with color

```javascript
await webhook.sendStatus(
  'error', // 'success' | 'warning' | 'error' | 'info'
  'Build Failed',
  'Compilation error in src/index.js'
);
```

**`createEmbed()`** - Create an embed builder

```javascript
const embed = webhook.createEmbed()
  .setTitle('Build Report')
  .setDescription('Build #456 completed')
  .setStatusColor('success')
  .addField('Branch', 'main', true)
  .addField('Commit', 'abc123', true)
  .setFooter('Powered by AVA')
  .build();

await webhook.sendEmbeds([embed]);
```

### EmbedBuilder Class

Fluent builder for creating complex Discord embeds.

```javascript
const { EmbedBuilder } = require('discord-webhook-helper');

const embed = new EmbedBuilder()
  .setTitle('My Embed')
  .setDescription('Embed description')
  .setColor(0x00FF00) // Or setStatusColor('success')
  .setUrl('https://example.com')
  .setTimestamp()
  .setFooter('Footer text', 'https://example.com/icon.png')
  .setImage('https://example.com/image.png')
  .setThumbnail('https://example.com/thumb.png')
  .addField('Field 1', 'Value 1', true) // inline = true
  .addField('Field 2', 'Value 2', false)
  .build();
```

#### Builder Methods

- `setTitle(title)` - Set embed title
- `setDescription(description)` - Set embed description
- `setColor(color)` - Set embed color (hex number)
- `setStatusColor(status)` - Set color from predefined status
- `setUrl(url)` - Set embed URL
- `setTimestamp()` - Set timestamp to now
- `setFooter(text, iconUrl?)` - Set footer text and icon
- `setImage(url)` - Set embed image
- `setThumbnail(url)` - Set embed thumbnail
- `addField(name, value, inline?)` - Add a single field
- `addFields(fields)` - Add multiple fields
- `build()` - Return the embed object

### Status Colors

Predefined colors for common status types:

- `'success'` - Green (`0x57F287`)
- `'warning'` - Yellow (`0xFEE75C`)
- `'error'` - Red (`0xED4245`)
- `'info'` - Blue (`0x5865F2`)

## Examples

### Deployment Notification

```javascript
const { sendStatus } = require('discord-webhook-helper');

await sendStatus(
  process.env.DISCORD_WEBHOOK_URL,
  'success',
  'Deployment Successful',
  'Version 2.5.0 deployed to production',
  {
    username: 'Deploy Bot',
    fields: [
      { name: '🚀 Version', value: '2.5.0', inline: true },
      { name: '🌍 Environment', value: 'production', inline: true },
      { name: '⏱️  Duration', value: '3m 45s', inline: true },
      { name: '📦 Commit', value: 'abc123def', inline: true },
      { name: '👤 Deployer', value: 'john', inline: true },
      { name: '🔗 View', value: '[GitHub](https://github.com)', inline: true },
    ]
  }
);
```

### Error Alert

```javascript
const { sendStatus } = require('discord-webhook-helper');

await sendStatus(
  process.env.DISCORD_WEBHOOK_URL,
  'error',
  'Server Down',
  'Production server is not responding',
  {
    fields: [
      { name: 'Server', value: 'web-01', inline: true },
      { name: 'Region', value: 'us-east-1', inline: true },
      { name: 'Error', value: 'Connection timeout', inline: true },
    ],
    imageUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjEx/xyz/giphy.gif'
  }
);
```

### Daily Report

```javascript
const { DiscordWebhook, EmbedBuilder } = require('discord-webhook-helper');

const webhook = new DiscordWebhook({
  webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  username: 'Daily Reporter'
});

const embed = new EmbedBuilder()
  .setTitle('📊 Daily Metrics Report')
  .setDescription('Summary of today\'s activity')
  .setStatusColor('info')
  .setTimestamp()
  .addField('📋 Issues Closed', '15', true)
  .addField('🔀 PRs Merged', '8', true)
  .addField('🐛 Bugs Fixed', '3', true)
  .addField('⭐ Stars Gained', '42', true)
  .addField('👥 Contributors', '5', true)
  .addField('📈 Test Coverage', '87%', true)
  .addField('\u200b', '\u200b', true) // Spacer
  .addField('🔗 View Details', '[Dashboard](https://dashboard.example.com)', false)
  .build();

await webhook.sendEmbeds([embed]);
```

### With Custom Avatar

```javascript
const { sendWebhook } = require('discord-webhook-helper');

await sendWebhook(
  process.env.DISCORD_WEBHOOK_URL,
  'Custom avatar test',
  {
    username: 'Custom Bot',
    avatarUrl: 'https://example.com/bot-avatar.png',
    embeds: [
      {
        title: 'Testing',
        description: 'This message has a custom avatar'
      }
    ]
  }
);
```

## Testing

Run the test suite with a real Discord webhook:

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"
npm test
```

Run without a webhook to test syntax and validation only:

```bash
npm test
```

## TypeScript Support

Full TypeScript types are included:

```typescript
import {
  DiscordWebhook,
  EmbedBuilder,
  DiscordStatusColor,
  DiscordEmbedField,
  sendWebhook,
  sendStatus
} from 'discord-webhook-helper';

const webhook = new DiscordWebhook({
  webhookUrl: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'
});

const status: DiscordStatusColor = 'success';
const fields: DiscordEmbedField[] = [
  { name: 'Test', value: 'Value' }
];

await webhook.sendStatus(status, 'Title', 'Description', fields);
```

## Error Handling

The library provides clear error messages:

```javascript
try {
  await sendWebhook('https://example.com/webhook', 'test');
} catch (error) {
  console.error('Failed:', error.message);
  // "Invalid webhook URL. Must be a Discord webhook URL."
}
```

Common errors:
- Invalid webhook URL format
- Too many embeds (max 10)
- Discord API errors (4xx/5xx responses)
- Network timeouts

## License

MIT

## Author

AVA <ava@avant-iconic.com>

## Contributing

Contributions welcome! Please open an issue or submit a PR.
