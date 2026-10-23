function Sidebar({ messages }) {
  return (
    <div className="flex h-screen w-64 shrink-0 flex-col bg-[#202123] p-4 text-white">
      <h2 className="mb-4 text-xl font-bold">
        Chat History
      </h2>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className="truncate rounded-lg px-3 py-2 hover:bg-[#343541]"
          >
            {message.user}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;