/**
 * Telegram Notification Helper for Store B (Velan)
 *
 * Sends formatted HTML messages to a Telegram chat using a Bot.
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram Notification: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Telegram API Error:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram Notification Error:", error);
    return false;
  }
}
