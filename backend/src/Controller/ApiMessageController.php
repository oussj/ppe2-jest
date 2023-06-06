<?php
namespace App\Controller;
use App\Entity\Messages;
use App\Entity\User;
use App\Repository\MessagesRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiMessageController extends AbstractController
{
    #[Route('/apimessage', name: 'app_api_message', methods:['POST'])]
    public function index(Request $request, MessagesRepository $messagesRepository): Response
    {
        $data = json_decode($request->getContent(), true
    );
        $content = $data['content'];
        $senderId = $data['sender_id'];
        $receiverId = $data['receiver_id'];
        
        $message = new Messages();
        $message->setContent($content);
        
        // Retrieve sender and receiver entities from their IDs
        $sender = $messagesRepository->find($senderId);
        $receiver =$messagesRepository->find($receiverId);
        
        $message->setSender($sender);
        $message->setReceiver($receiver);
        
        // Persist the entity to the database
        $messagesRepository->save($message, true);
        dump($message);
        return new JsonResponse([$content]);
    }
}
