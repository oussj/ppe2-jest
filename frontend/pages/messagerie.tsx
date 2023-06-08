import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserSelect } from "@/components/User";

type Message = {
  id: number;
  content: string;
  receiverId: number;
  senderId: number;
};

type MessagerieFormData = {
  content: string;
};

export default function Messagerie() {
  const { register, handleSubmit, reset } = useForm<MessagerieFormData>();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/apimessage`,
          {},
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
    setSelectedUserId(userId);
  };

  const onSubmit = async (data: MessagerieFormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/apimessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: data.content,
          receiver_id: selectedUserId,
        }),
      }
    );

    const jsonResponse = await response.json();
    const newMessage: Message = JSON.parse(jsonResponse);

    // Ajouter le nouveau message à l'état (state) de messages
    setMessagesList([...messagesList, newMessage]);

    reset();
  };

  return (
    <>
      {messagesList.map((message) => (
        <div
          key={message.id}
          style={{
            display: "flex",
            justifyContent:
              message.receiverId === selectedUserId ? "flex-start" : "flex-end",
          }}
        >
          <p>{message.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserSelect onUserSelected={handleUserSelected} />
        <label>
          Message de test :
          <input {...register("content")} />
        </label>
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}
