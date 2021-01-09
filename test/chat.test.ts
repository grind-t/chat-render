import { assertEquals } from "https://deno.land/std@/testing/asserts.ts";
import { Chat, Message } from "../lib/chat.ts";

Deno.test("Chat.push", () => {
  const messageMock = () =>
    <Message> {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    };
  const chat = new Chat(100, 100);
  console.log("\nScrolls down the chat and deletes invisible messages");
  chat.push(messageMock(), 10);
  chat.push(messageMock(), 10);
  chat.push(messageMock(), 10);
  assertEquals(chat.messages[0].y, -10);
  assertEquals(chat.messages[1].y, 50);
  assertEquals(chat.messages.length, 2);
});
