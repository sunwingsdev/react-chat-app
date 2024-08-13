/* eslint-disable react/prop-types */
const JoinChatForm = ({ onJoin, username, setUsername, roomId, setRoomId }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin();
  };

  return (
    <div className="bg-[#2f3136] rounded-[8px] shadow-[ 0 4px 14px rgba(0, 0, 0, 0.3)] text-center flex flex-col justify-center items-center h-screen text-[#fff]">
      <h1 className="text-[#7289da] mb-[20px] text-4xl font-bold">
        Join a room to chat
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center"
        action=""
      >
        <input
          className="w-[300px] p-[10px] my-[10px] rounded-[4px] border-solid border border-[#202225] text-black placeholder:text-[#b9bbbe]"
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <input
          className="w-[300px] p-[10px] my-[10px] rounded-[4px] border-solid border border-[#202225] text-black placeholder:text-[#b9bbbe]"
          type="text"
          placeholder="Enter a room id"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          required
        />
        <button
          className="w-[300px] p-[10px] mt-[20px] border-none rounded-[4px] cursor-pointer bg-[#7289da] transition duration-300 hover:bg-[#677bc4]"
          type="submit"
        >
          Join Room Now
        </button>
      </form>
    </div>
  );
};

export default JoinChatForm;
