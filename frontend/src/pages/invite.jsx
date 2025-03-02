/*
This page lets users invite their friends to play.
    A user can generate a unique invite link.
    The backend creates an invite token for sharing.
    The user can copy and send the invite link to friends.
    Clicking the link will redirect new users to register and play.
*/
import { useState } from "react";
import { generateInvite } from "../utils/api";

const Invite = () => {
  const [userId, setUserId] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const handleGenerateInvite = async () => {
    const data = await generateInvite(userId);
    if (data.invite_link) {
      setInviteLink(data.invite_link);
    }
  };

  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Invite Friends</h2>
      <input
        type="text"
        placeholder="Enter Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="p-2 border rounded-lg w-64 text-lg mb-2"
      />
      <button
        onClick={handleGenerateInvite}
        className="bg-purple-500 text-white p-3 rounded-lg text-lg hover:bg-purple-600"
      >
        Generate Invite
      </button>
      {inviteLink && (
        <p className="mt-4 text-lg font-bold">
          Share this invite link: <a href={inviteLink} className="text-blue-600 underline">{inviteLink}</a>
        </p>
      )}
    </div>
  );
};

export default Invite;
