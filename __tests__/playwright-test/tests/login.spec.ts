import { test, expect } from '@playwright/test';

test('chatbot returns a response', async ({ page }) => {
  test.setTimeout(180000); // Increase timeout to 3 minutes

  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Start Chatting' }).click();
  await page.getByPlaceholder('you@example.com').click();
  await page.getByPlaceholder('you@example.com').fill('vinod@pittampalli.com');
  await page.getByPlaceholder('you@example.com').press('Tab');
  await page.getByPlaceholder('••••••••').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.screenshot({ path: 'screenshot-after-login.png', fullPage: true });

  await page.getByPlaceholder('Ask anything. Type @  /  #  !').click();
  await page.getByPlaceholder('Ask anything. Type @  /  #  !').fill('why is the sky blue?');
  await page.locator('.absolute > .bg-primary').first().click();

  await page.screenshot({ path: 'screenshot-after-sending-message.png', fullPage: true });
  
  console.log('Waiting for response...');
  
  try {
    // Wait for the GPT-4 Turbo response container to appear
    await page.waitForSelector('.flex.w-full.justify-center.bg-secondary', { timeout: 60000 });
    console.log('Response container is visible');

    // Use a more specific locator for the response text
    const responseLocator = page.locator('.flex.w-full.justify-center.bg-secondary .prose p');
    
    let responseTexts: string[] = [];
    for (let i = 0; i < 24; i++) {  // Try for 2 minutes (5s * 24)
      await page.waitForTimeout(5000);  // Wait 5 seconds before each check
      responseTexts = await responseLocator.allTextContents();
      console.log(`Attempt ${i + 1}: Response paragraphs: ${responseTexts.length}`);
      console.log(`Response text: "${responseTexts.join(' ').trim().substring(0, 100)}..."`);
      if (responseTexts.length > 0 && responseTexts[0].trim() !== '') break;
    }

    // Take final screenshot
    await page.screenshot({ path: 'screenshot-final.png', fullPage: true });

    // Final assertion
    const combinedResponseText = responseTexts.join(' ').trim();
    expect(combinedResponseText).not.toBe('');

  } catch (error) {
    console.error('Error occurred:', error);
    await page.screenshot({ path: 'screenshot-error.png', fullPage: true });
    throw error;
  }
});