
import { useState,useEffect,useRef } from "react";
import Sidebar from "./components/sidebar";
import "./index.css";

const APPLICATION_NAME="Archit Chatbot"

const giveName = () =>{
 return(APPLICATION_NAME)
}
      

function App() {
  const [input, setInput] = useState("");
  
  const[conversations,setConversations]=useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(() => {
  try {
    const savedMessages = localStorage.getItem("chatMessages");

    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
});


  useEffect(()=>{
    async function getData(){
      try{
      const response=await fetch("/chatData.json");
      console.log("fetch response:",response);
      console.log("Response successfull:",response.ok);
      if(!response.ok){
        throw new Error("failed to fetch data");
      }

      const data = await response.json();
      console.log("JSON data",data);
      console.log("Conversations loaded:", data.conversations);
      setConversations(data.conversations);
    }
    catch(error){
      console.log("Error:",error);
    }
    finally{
      setLoading(false);
    }
    }
    getData();
  },[]);

     

  const messagesEndRef = useRef();

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});

  },[messages]);


  
  useEffect(() => {
  localStorage.setItem(
    "chatMessages",
    JSON.stringify(messages));
     console.log("Messages saved to localStorage:", messages);
  console.log(
    "Stored string:",
    localStorage.getItem("chatMessages")

  );
}, [messages]);

  

 
function handleSend() {
  if (input.trim() === "") return;

  const userMessage = input.trim();
    console.log("User typed:", userMessage);
 

 const found = conversations.find(
  (item) =>
    item.user.trim().toLowerCase() ===
    userMessage.trim().toLowerCase()
);
console.log("Matching conversation:", found);

  const conversation = {
    id: Date.now(),
    user: userMessage,
    userTimestamp: new Date().toISOString(),
    bot: found
      ? found.bot
      : "Sorry, I don't have an answer for that.",
    botTimestamp: new Date().toISOString(),
  };

  setMessages((prevMessages) => [
    ...prevMessages,
    conversation,
  ]);
  console.log("New conversation created:", conversation);

  setInput("");
}


  return (
    <div className="flex h-screen w-full">
      <Sidebar messages={messages} />

      <div className="flex min-w-0 flex-1 flex-col bg-[#141414] p-6">
        <h1 className="text-4xl font-bold text-red-500 text-center">
          Ask me anything!
        </h1>
         {loading && (
  <p className="text-center text-gray-400">
    Loading chatbot data...
  </p>
)}

        
<div className="flex flex-1 flex-col gap-4 overflow-y-auto py-5">
  {messages.map((message) => (
    <div key={message.id} className="flex flex-col gap-3">

      
      <div className="max-w-[70%] self-end break-words rounded-2xl bg-[#343541] px-5 py-3 text-white">
        <p>{message.user}</p>
        
      </div>

     
      <div className="max-w-[70%] self-start break-words px-5 py-3 text-white ">
        <p>{message.bot}</p>
        
      </div>
    </div>
  ))}

  <div ref={messagesEndRef} />
</div>

       

        <div className="flex gap-2 rounded-2xl border border-gray-500 p-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
         
          <button
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
      <div>
        {giveName()}
      </div>
    </div>
  );
}

export default App;
