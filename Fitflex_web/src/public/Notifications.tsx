// Notifications.tsx
const Notifications: React.FC = () => {
    const notifications = [
      { message: "Time to stretch and warm up!", time: "10:00 AM" },
      { message: "You haven't logged any meals today.", time: "12:00 PM" },
      { message: "Don't forget to drink water!", time: "2:00 PM" },
    ];
  
    return (
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full">
        <h2 className="text-xl text-purple-300 font-semibold mb-4">🔔 Reminder</h2>
        <ul className="text-sm text-gray-300">
          {notifications.map((notification, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{notification.message}</span>
              <span>{notification.time}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Notifications;
  