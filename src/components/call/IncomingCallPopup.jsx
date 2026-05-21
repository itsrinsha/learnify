const IncomingCallPopup = ({
  caller,
  onAccept,
  onReject,
}) => {

  return (
    <div className="fixed top-5 right-5 z-50 bg-white shadow-2xl rounded-2xl p-5 w-[320px]">

      <h2 className="text-xl font-semibold text-gray-800">
        Incoming Call
      </h2>

      <p className="text-gray-600 mt-2">
        {caller?.name} is calling...
      </p>

      <div className="flex gap-3 mt-5">

        <button
          onClick={onAccept}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
        >
          Accept
        </button>

        <button
          onClick={onReject}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
        >
          Decline
        </button>

      </div>

    </div>
  );
};

export default IncomingCallPopup;