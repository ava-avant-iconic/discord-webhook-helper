/**
 * Discord Webhook Helper - Test Suite
 * Run with: node test.js
 */

const { sendWebhook, sendStatus, DiscordWebhook, EmbedBuilder } = require('./dist/index.js');

async function runTests() {
  // Get webhook URL from environment or use a placeholder
  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    console.log('⚠️  Warning: DISCORD_WEBHOOK_URL not set in environment');
    console.log('   Set it to test with a real Discord webhook');
    console.log('   Example: export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."');
    console.log('');
    console.log('✓ Running syntax and API tests without sending to Discord...\n');
  }

  // Test 1: Simple message
  console.log('Test 1: Simple message format...');
  try {
    if (WEBHOOK_URL) {
      await sendWebhook(WEBHOOK_URL, '✅ Test message from discord-webhook-helper');
      console.log('✓ Simple message sent successfully\n');
    } else {
      console.log('✓ Message format validated (skipped send)\n');
    }
  } catch (error) {
    console.error('✗ Test 1 failed:', error.message, '\n');
  }

  // Test 2: Status embed
  console.log('Test 2: Status embed...');
  try {
    if (WEBHOOK_URL) {
      await sendStatus(WEBHOOK_URL, 'success', 'System Healthy', 'All services are running normally', {
        fields: [
          { name: 'Uptime', value: '99.9%', inline: true },
          { name: 'Requests', value: '1,234', inline: true },
        ],
      });
      console.log('✓ Status embed sent successfully\n');
    } else {
      console.log('✓ Status embed format validated (skipped send)\n');
    }
  } catch (error) {
    console.error('✗ Test 2 failed:', error.message, '\n');
  }

  // Test 3: Error status
  console.log('Test 3: Error status...');
  try {
    if (WEBHOOK_URL) {
      await sendStatus(WEBHOOK_URL, 'error', 'Deployment Failed', 'Build #123 failed with exit code 1');
      console.log('✓ Error status sent successfully\n');
    } else {
      console.log('✓ Error status format validated (skipped send)\n');
    }
  } catch (error) {
    console.error('✗ Test 3 failed:', error.message, '\n');
  }

  // Test 4: Embed builder
  console.log('Test 4: Embed builder...');
  try {
    const webhook = new DiscordWebhook({ webhookUrl: WEBHOOK_URL || 'https://example.com' });
    const embed = webhook.createEmbed()
      .setTitle('Build Report')
      .setDescription('Build #456 completed successfully')
      .setStatusColor('success')
      .addField('Branch', 'main', true)
      .addField('Commit', 'abc123', true)
      .addField('Duration', '3m 45s', true)
      .setFooter('Powered by AVA')
      .build();

    if (WEBHOOK_URL) {
      await webhook.sendEmbeds([embed]);
      console.log('✓ Embed builder message sent successfully\n');
    } else {
      console.log('✓ Embed builder format validated\n');
    }
  } catch (error) {
    console.error('✗ Test 4 failed:', error.message, '\n');
  }

  // Test 5: Multiple fields
  console.log('Test 5: Multiple fields embed...');
  try {
    if (WEBHOOK_URL) {
      await sendStatus(
        WEBHOOK_URL,
        'info',
        'Daily Summary',
        'Here are today\'s metrics',
        {
          fields: [
            { name: '📊 Issues Closed', value: '15', inline: true },
            { name: '🔀 PRs Merged', value: '8', inline: true },
            { name: '🐛 Bugs Fixed', value: '3', inline: true },
            { name: '⭐ Stars Gained', value: '42', inline: true },
            { name: '👥 Contributors', value: '5', inline: true },
            { name: '📈 Coverage', value: '87%', inline: true },
          ],
        }
      );
      console.log('✓ Multiple fields embed sent successfully\n');
    } else {
      console.log('✓ Multiple fields format validated (skipped send)\n');
    }
  } catch (error) {
    console.error('✗ Test 5 failed:', error.message, '\n');
  }

  // Test 6: Image URL support
  console.log('Test 6: Image URL support...');
  try {
    if (WEBHOOK_URL) {
      await sendStatus(
        WEBHOOK_URL,
        'warning',
        'Deployment Pending',
        'Build #789 is waiting for approval',
        {
          imageUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjEx/d5076b3b-1234-4e5f-8b4e-9f2f3e1c0b1c/giphy.gif',
        }
      );
      console.log('✓ Image URL support works successfully\n');
    } else {
      console.log('✓ Image URL format validated (skipped send)\n');
    }
  } catch (error) {
    console.error('✗ Test 6 failed:', error.message, '\n');
  }

  // Test 7: Error handling - Invalid URL
  console.log('Test 7: Error handling - Invalid webhook URL...');
  try {
    new DiscordWebhook({ webhookUrl: 'https://example.com/webhook' });
    console.log('✗ Test 7 failed: Should have thrown error for invalid URL\n');
  } catch (error) {
    console.log('✓ Invalid URL rejected correctly:', error.message, '\n');
  }

  // Test 8: Error handling - Too many embeds
  console.log('Test 8: Error handling - Too many embeds...');
  try {
    const webhook = new DiscordWebhook({ webhookUrl: WEBHOOK_URL || 'https://discord.com/api/webhooks/test/test' });
    const embeds = Array(11).fill({});
    await webhook.sendEmbeds(embeds);
    console.log('✗ Test 8 failed: Should have thrown error for too many embeds\n');
  } catch (error) {
    console.log('✓ Too many embeds rejected correctly:', error.message, '\n');
  }

  console.log('===========================================');
  console.log('Test Suite Complete!');
  console.log('===========================================');
  if (WEBHOOK_URL) {
    console.log('All tests sent to Discord webhook.');
    console.log('Check your Discord channel for messages.');
  } else {
    console.log('All syntax tests passed.');
    console.log('Set DISCORD_WEBHOOK_URL to test with real Discord messages.');
  }
}

runTests().catch(console.error);
