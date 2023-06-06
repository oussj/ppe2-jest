import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import axios from "axios";
import { User, UserSelect } from "@/components/user";

type Message = {
  id: number;
  content: string;
  sender: any;
  receiver: any;
};

type MessagerieFormData = {
  message_send: string;
};

export default function Messagerie() {
  const { register, handleSubmit, watch } = useForm<MessagerieFormData>();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/apimessage`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const messages = response.data;
        setMessagesList(messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  const handleUserSelected = (userId: any) => {
    console.log(userId);
    setSelectedUserId(userId);
  };

  const onSubmit = async (data: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/apimessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message_send: data.message_send,
          id_user: selectedUserId ?? null,
        }),
      }
    );

    const jsonResponse = await response.json();
    setMessage(jsonResponse.message);
    // Ajouter le nouveau message à l'état (state) de messages
    setMessagesList([...messagesList, ...jsonResponse]);
    console.log(message);
  };

  return (
    <>
      {messagesList.map((message) => (
        <p key={message.id}>{message.content}</p>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserSelect onUserSelected={handleUserSelected}></UserSelect>
        <label>
          Message de test :
          <input {...register("message_send")} />
        </label>
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}