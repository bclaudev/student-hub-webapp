const TimetableItem = ({ event }) => {
  return (
    <div className="px-2 py-1 text-sm font-medium text-white bg-[#a585ff] rounded">
      <div>{event.title}</div>
      {event.location && <div className="text-xs">{event.location}</div>}
    </div>
  );
};

export default TimetableItem;
