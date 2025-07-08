// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { 
//   faDollarSign, 
//   faUsers, 
//   faBatteryThreeQuarters, 
//   faStore,
//   faChartLine,
//   faArrowUp,
//   faArrowDown,
//   faClock,
//   faMapMarkerAlt
// } from '@fortawesome/free-solid-svg-icons'

// const Dashboard = () => {
//   const stats = [
//     {
//       title: 'Total Revenue',
//       value: '$72,450',
//       change: '+15.3%',
//       changeType: 'positive',
//       icon: faDollarSign,
//       color: 'blue',
//       bgColor: 'bg-blue-100 dark:bg-blue-900',
//       textColor: 'text-blue-600 dark:text-blue-400'
//     },
//     {
//       title: 'Active Users',
//       value: '2,847',
//       change: '+8.2%',
//       changeType: 'positive',
//       icon: faUsers,
//       color: 'green',
//       bgColor: 'bg-green-100 dark:bg-green-900',
//       textColor: 'text-green-600 dark:text-green-400'
//     },
//     {
//       title: 'Power Banks',
//       value: '156',
//       change: '+12.1%',
//       changeType: 'positive',
//       icon: faBatteryThreeQuarters,
//       color: 'purple',
//       bgColor: 'bg-purple-100 dark:bg-purple-900',
//       textColor: 'text-purple-600 dark:text-purple-400'
//     },
//     {
//       title: 'Stations',
//       value: '24',
//       change: '+4.5%',
//       changeType: 'positive',
//       icon: faStore,
//       color: 'orange',
//       bgColor: 'bg-orange-100 dark:bg-orange-900',
//       textColor: 'text-orange-600 dark:text-orange-400'
//     }
//   ]

//   const recentActivity = [
//     {
//       id: 1,
//       type: 'rental',
//       user: 'Ahmed Hassan',
//       station: 'Cafe Castello Boondheere',
//       time: '2 minutes ago',
//       amount: '$2.50'
//     },
//     {
//       id: 2,
//       type: 'return',
//       user: 'Fatima Ali',
//       station: 'Java Taleex',
//       time: '5 minutes ago',
//       amount: '$3.00'
//     },
//     {
//       id: 3,
//       type: 'rental',
//       user: 'Omar Mohamed',
//       station: 'Cafe Castello Taleex',
//       time: '8 minutes ago',
//       amount: '$2.50'
//     },
//     {
//       id: 4,
//       type: 'return',
//       user: 'Aisha Ahmed',
//       station: 'Cafe Castello Cali K Cali Kamlin',
//       time: '12 minutes ago',
//       amount: '$4.00'
//     }
//   ]

//   const topStations = [
//     {
//       name: 'Cafe Castello Boondheere',
//       revenue: '$8,450',
//       rentals: 320,
//       availability: 85
//     },
//     {
//       name: 'Java Taleex',
//       revenue: '$7,200',
//       rentals: 280,
//       availability: 92
//     },
//     {
//       name: 'Cafe Castello Taleex',
//       revenue: '$6,800',
//       rentals: 250,
//       availability: 78
//     }
//   ]

//   return (
//     <div className="p-4 space-y-6">
//       {/* Welcome Section */}
//       <div className="p-6 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="mb-2 text-2xl font-bold">Welcome back, Admin! 👋</h2>
//             <p className="text-blue-100">Here's what's happening with your power bank rental business today.</p>
//           </div>
//           <div className="hidden md:block">
//             <div className="text-right">
//               <p className="text-sm text-blue-100">Current Time</p>
//               <p className="text-xl font-semibold">{new Date().toLocaleTimeString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat, index) => (
//           <div 
//             key={index}
//             className="p-6 transition-all duration-300 transform bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 hover:shadow-md hover:-translate-y-1 dark:border-gray-700"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="mt-1 text-2xl font-bold dark:text-white">{stat.value}</h3>
//                 <div className="flex items-center mt-2">
//                   <FontAwesomeIcon 
//                     icon={stat.changeType === 'positive' ? faArrowUp : faArrowDown} 
//                     className={`mr-1 text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} 
//                   />
//                   <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
//                     {stat.change}
//                   </span>
//                   <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">vs last month</span>
//                 </div>
//               </div>
//               <div className={`p-3 rounded-full ${stat.bgColor}`}>
//                 <FontAwesomeIcon icon={stat.icon} className={`text-xl ${stat.textColor}`} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts and Activity Section */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Revenue Chart */}
//         <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-semibold dark:text-white">Revenue Overview</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days performance</p>
//             </div>
//             <div className="flex space-x-2">
//               <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md">Daily</button>
//               <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300">Weekly</button>
//             </div>
//           </div>
          
//           {/* Simple Bar Chart */}
//           <div className="flex items-end justify-between h-64 space-x-2">
//             {[1200, 1350, 1100, 1400, 1600, 1800, 2000].map((value, index) => {
//               const height = (value / 2000) * 100
//               const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//               return (
//                 <div key={index} className="flex flex-col items-center flex-1">
//                   <div className="relative w-full bg-gray-200 rounded-t-sm dark:bg-gray-700 group">
//                     <div
//                       className="transition-all duration-300 rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300"
//                       style={{ height: `${height}%` }}
//                     ></div>
//                     <div className="absolute px-2 py-1 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-800 rounded opacity-0 -top-8 left-1/2 group-hover:opacity-100">
//                       ${value.toLocaleString()}
//                     </div>
//                   </div>
//                   <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{days[index]}</span>
//                 </div>
//               )
//             })}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold dark:text-white">Recent Activity</h3>
//             <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
//               View All
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {recentActivity.map((activity) => (
//               <div key={activity.id} className="flex items-start p-3 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-700">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   activity.type === 'rental' 
//                     ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
//                     : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
//                 }`}>
//                   <FontAwesomeIcon 
//                     icon={activity.type === 'rental' ? faBatteryThreeQuarters : faStore} 
//                     className="text-sm" 
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium dark:text-white">
//                     {activity.user}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {activity.type === 'rental' ? 'Rented' : 'Returned'} at {activity.station}
//                   </p>
//                   <div className="flex items-center mt-1">
//                     <FontAwesomeIcon icon={faClock} className="mr-1 text-xs text-gray-400" />
//                     <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
//                     <span className="mx-2 text-gray-300">•</span>
//                     <span className="text-xs font-medium text-green-600 dark:text-green-400">{activity.amount}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Top Stations and Quick Actions */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Top Performing Stations */}
//         <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
//           <h3 className="mb-4 text-lg font-semibold dark:text-white">Top Performing Stations</h3>
//           <div className="space-y-4">
//             {topStations.map((station, index) => (
//               <div key={index} className="flex items-center justify-between p-4 transition-colors duration-200 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg dark:bg-blue-900">
//                     <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium dark:text-white">{station.name}</p>
//                     <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
//                       <span>{station.rentals} rentals</span>
//                       <span>{station.availability}% available</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-semibold dark:text-white">{station.revenue}</p>
//                   <p className="text-xs text-green-500">+12.5%</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
//           <h3 className="mb-4 text-lg font-semibold dark:text-white">Quick Actions</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="p-4 text-left transition-colors duration-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30">
//               <div className="flex items-center justify-center w-8 h-8 mb-2 bg-blue-100 rounded-lg dark:bg-blue-900">
//                 <FontAwesomeIcon icon={faStore} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <p className="text-sm font-medium dark:text-white">Add Station</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">Create new location</p>
//             </button>
            
//             <button className="p-4 text-left transition-colors duration-200 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30">
//               <div className="flex items-center justify-center w-8 h-8 mb-2 bg-green-100 rounded-lg dark:bg-green-900">
//                 <FontAwesomeIcon icon={faBatteryThreeQuarters} className="text-green-600 dark:text-green-400" />
//               </div>
//               <p className="text-sm font-medium dark:text-white">Add Power Banks</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">Inventory management</p>
//             </button>
            
//             <button className="p-4 text-left transition-colors duration-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30">
//               <div className="flex items-center justify-center w-8 h-8 mb-2 bg-purple-100 rounded-lg dark:bg-purple-900">
//                 <FontAwesomeIcon icon={faUsers} className="text-purple-600 dark:text-purple-400" />
//               </div>
//               <p className="text-sm font-medium dark:text-white">Manage Users</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">User administration</p>
//             </button>
            
//             <button className="p-4 text-left transition-colors duration-200 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30">
//               <div className="flex items-center justify-center w-8 h-8 mb-2 bg-orange-100 rounded-lg dark:bg-orange-900">
//                 <FontAwesomeIcon icon={faChartLine} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <p className="text-sm font-medium dark:text-white">View Reports</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">Analytics & insights</p>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard 