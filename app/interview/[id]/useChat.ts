import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function useChat({
  messages = [],
  setMessages = () => {},
  setAiSpeaking = () => {},
  setIsInterviewCompleted = () => {},
  generateSpeech = () => {},
   terminateAudio = () => {}, // TTS function
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  
  function cleanTextForTTS(text: string) {
    return text
      // Remove markdown bold/italic
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")

      // Remove headings (#, ##, ###)
      .replace(/^#+\s*/gm, "")

      // Remove bullet points
      .replace(/^-+\s*/gm, "")
      .replace(/•\s*/g, "")

      // Remove extra line breaks
      .replace(/\n{2,}/g, ". ")

      // Trim spaces
      .trim();
  }

  
const sendMessage = useCallback(
  async ({ content, interviewDetails }: any): Promise<void> => {
    if (!content) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: Array.isArray(content) ? [...content] : content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev: any) => [...prev, userMessage]);
    terminateAudio(); // ✅ stop old speech instantly
    setIsLoading(true);
    setAiSpeaking(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const apiMessages = conversationHistory.map(({ role, content }) => ({
        role,
        content,
      }));

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          stream: false,
          interviewDetails,
        }),
      });

      if (!response.ok) {
        toast("Something went wrong...");
        setIsLoading(false);
        setAiSpeaking(false);
        return;
      }

      const data = await response.json();
      const aiContent = data?.content?.result || "";

      console.log("AI Response Content:", data);

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev: any) => [...prev, aiMessage]);

      if (aiContent.toLowerCase().includes("interview is completed")) {
        setIsInterviewCompleted(true);
      }

      // 🔹 Generate AI speech after full response
      if (aiContent) {
        const cleanedText = cleanTextForTTS(aiContent);
        generateSpeech(cleanedText);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast("Failed to get response from AI");
    } finally {
      setIsLoading(false);
      setAiSpeaking(false);
    }
  },
  [messages, setMessages, generateSpeech, terminateAudio]

);

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
