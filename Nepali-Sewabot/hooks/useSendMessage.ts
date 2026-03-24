import { conversationAPI, useRagApiClient } from "@/utils/api_rag";
import { useState } from "react";
// import { useRagApiClient } from "@/services/ragApiClient";
// import { conversationAPI } from "@/services/ragApi";

export const useSendMessage = () => {
  const api = useRagApiClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const sendMessage = async (
    conversationId: number | string,
    content: string,
    useRag: boolean = true
  ) => {
    try {
      setLoading(true);
      setError(null);
// 
      const res = await conversationAPI.addMessage(
        api,
        conversationId,
        content,
        useRag
      );

      setData(res.data);
      console.log("response:",res.data)
      return res.data;
    } catch (err) {
         console.log("response:",err)
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error,
    data,
  };
};