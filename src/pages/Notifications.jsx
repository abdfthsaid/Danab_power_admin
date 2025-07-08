const notifications = [
  {
    id: 1,
    title: 'Power Bank Low Battery',
    description: 'Station: Java Taleex Branch',
    time: '10 minutes ago',
    type: 'warning',
  },
  // ...more notifications
];

const Notifications = () => (
  <div className="p-4 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 dark:text-white">All Notifications</h2>
    <div className="space-y-4">
      {notifications.map((n) => (
        <div key={n.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="font-semibold">{n.title}</div>
          <div className="text-gray-500 dark:text-gray-400">{n.description}</div>
          <div className="text-xs text-gray-400 mt-1">{n.time}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Notifications; 