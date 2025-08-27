import { useEffect, useState } from 'react';
import { apiService } from '../api/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faMoneyBillWave, faChartBar, faUsers, faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StationComparison = () => {
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [stationData, setStationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartsLoading, setChartsLoading] = useState(false);

  // Fetch all stations
  // useEffect(() => {
  //   const fetchStations = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await apiService.getStations();
  //       setStations(response.data.stations || []);
  //     } catch (err) {
  //       setError('Failed to fetch stations');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStations();
  // }, []);
   useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStations();
        const fetchedStations = response.data.stations || [];
        setStations(fetchedStations);
        setSelectedStations(fetchedStations.map((s) => s.imei)); 
      } catch (err) {
        setError('Failed to fetch stations');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // Fetch data for selected stations
  useEffect(() => {
    const fetchStationData = async () => {
      if (selectedStations.length === 0) {
        setStationData({});
        return;
      }

      setChartsLoading(true);
      const newStationData = {};

      try {
        await Promise.all(
          selectedStations.map(async (imei) => {
            try {
              const [dailyRes, monthlyRes, dailyCustRes, monthlyCustRes, chartsRes] = await Promise.all([
                apiService.getDailyRevenue(imei),
                apiService.getMonthlyRevenue(imei),
                apiService.getDailyCustomers(imei),
                apiService.getMonthlyCustomers(imei),
                apiService.getChartsByImei(imei)
              ]);

              newStationData[imei] = {
                daily: dailyRes.data,
                monthly: monthlyRes.data,
                dailyCustomers: dailyCustRes.data,
                monthlyCustomers: monthlyCustRes.data,
                charts: chartsRes.data,
                name: stations.find(s => s.imei === imei)?.name || 'Unknown Station'
              };
            } catch (err) {
              console.error(`Failed to fetch data for station ${imei}:`, err);
              newStationData[imei] = {
                error: 'Failed to fetch data',
                name: stations.find(s => s.imei === imei)?.name || 'Unknown Station'
              };
            }
          })
        );

        setStationData(newStationData);
      } catch (err) {
        setError('Failed to fetch station data');
      } finally {
        setChartsLoading(false);
      }
    };

    fetchStationData();
  }, [selectedStations, stations]);

  const handleStationToggle = (imei) => {
    setSelectedStations(prev => 
      prev.includes(imei) 
        ? prev.filter(id => id !== imei)
        : [...prev, imei]
    );
  };

  const handleSelectAll = () => {
    setSelectedStations(stations.map(s => s.imei));
  };

  const handleDeselectAll = () => {
    setSelectedStations([]);
  };

  const getChartData = (stationImei, chartType) => {
    const station = stationData[stationImei];
    if (!station?.charts) return null;

    const colors = [
      '#3b82f6', '#f59e42', '#10b981', '#8b5cf6', '#ef4444',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];

    const colorIndex = selectedStations.indexOf(stationImei) % colors.length;

    switch (chartType) {
      case 'dailyRevenue':
        return station.charts.dailyRevenue ? {
          labels: station.charts.dailyRevenue.labels,
          datasets: [{
            label: `${station.name} - Daily Revenue ($)`,
            data: station.charts.dailyRevenue.data,
            borderColor: colors[colorIndex],
            backgroundColor: `${colors[colorIndex]}20`,
            tension: 0.4,
            fill: true,
          }],
        } : null;
      case 'monthlyRevenue':
        return station.charts.monthlyRevenue ? {
          labels: station.charts.monthlyRevenue.labels,
          datasets: [{
            label: `${station.name} - Monthly Revenue ($)`,
            data: station.charts.monthlyRevenue.data,
            borderColor: colors[colorIndex],
            backgroundColor: `${colors[colorIndex]}20`,
            tension: 0.4,
            fill: true,
          }],
        } : null;
      case 'weeklyRevenue':
        return station.charts.weeklyRevenue ? {
          labels: station.charts.weeklyRevenue.labels,
          datasets: [{
            label: `${station.name} - Weekly Revenue ($)`,
            data: station.charts.weeklyRevenue.data,
            backgroundColor: colors[colorIndex],
            borderRadius: 8,
          }],
        } : null;
      default:
        return null;
    }
  };

  const getCombinedChartData = (chartType) => {
    const datasets = [];
    const colors = [
      '#3b82f6', '#f59e42', '#10b981', '#8b5cf6', '#ef4444',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];

    selectedStations.forEach((imei, index) => {
      const station = stationData[imei];
      if (!station?.charts) return;

      const colorIndex = index % colors.length;
      let data = null;

      switch (chartType) {
        case 'dailyRevenue':
          if (station.charts.dailyRevenue) {
            data = {
              label: station.name,
              data: station.charts.dailyRevenue.data,
              borderColor: colors[colorIndex],
              backgroundColor: `${colors[colorIndex]}20`,
              tension: 0.4,
              fill: false,
            };
          }
          break;
        case 'monthlyRevenue':
          if (station.charts.monthlyRevenue) {
            data = {
              label: station.name,
              data: station.charts.monthlyRevenue.data,
              borderColor: colors[colorIndex],
              backgroundColor: `${colors[colorIndex]}20`,
              tension: 0.4,
              fill: false,
            };
          }
          break;
        case 'weeklyRevenue':
          if (station.charts.weeklyRevenue) {
            data = {
              label: station.name,
              data: station.charts.weeklyRevenue.data,
              backgroundColor: colors[colorIndex],
              borderRadius: 8,
            };
          }
          break;
      }

      if (data) {
        datasets.push(data);
      }
    });

    if (datasets.length === 0) return null;

    // Use the labels from the first station that has data
    const firstStationWithData = selectedStations.find(imei => stationData[imei]?.charts);
    const labels = firstStationWithData ? 
      (chartType === 'weeklyRevenue' ? 
        stationData[firstStationWithData].charts.weeklyRevenue?.labels :
        chartType === 'monthlyRevenue' ? 
          stationData[firstStationWithData].charts.monthlyRevenue?.labels :
          stationData[firstStationWithData].charts.dailyRevenue?.labels
      ) : [];

    return {
      labels,
      datasets
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-lg text-blue-600 dark:text-blue-300 animate-pulse">Loading stations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-4 py-8 text-center shadow-lg bg-gradient-to-br from-purple-400 to-indigo-400 dark:from-gray-900 dark:to-gray-800 rounded-b-2xl">
        <h1 className="mb-2 text-3xl font-bold text-white">Station Comparison</h1>
        <p className="text-blue-100 dark:text-blue-300">Compare multiple stations side by side</p>
      </div>

      {/* Station Selection */}
      <div className="max-w-6xl px-4 mx-auto mt-8">
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Select Stations to Compare</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Deselect All
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <div
                key={station.imei}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedStations.includes(station.imei)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => handleStationToggle(station.imei)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white">{station.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IMEI: {station.imei}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{station.location}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedStations.includes(station.imei)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {selectedStations.includes(station.imei) && (
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {selectedStations.length > 0 && (
        <div className="max-w-6xl px-4 mx-auto mt-8">
          {chartsLoading ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">Loading comparison data...</div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {selectedStations.map((imei) => {
                  const station = stationData[imei];
                  if (!station || station.error) return null;

                  return (
                    <div key={imei} className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                      <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">{station.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Today's Revenue:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            ${station.daily?.totalRevenueToday?.toFixed(2) ?? '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            ${station.monthly?.totalRevenueMonthly?.toFixed(2) ?? '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Today's Customers:</span>
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {station.dailyCustomers?.totalCustomersToday ?? '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Customers:</span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            {station.monthlyCustomers?.totalCustomersThisMonth ?? '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combined Charts */}
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">Combined Charts</h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="mb-2 text-sm font-medium dark:text-white">Daily Revenue Comparison</h3>
                    {getCombinedChartData('dailyRevenue') ? (
                      <Line 
                        data={getCombinedChartData('dailyRevenue')} 
                        options={{ 
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            }
                          }
                        }} 
                        height={100} 
                      />
                    ) : (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                    )}
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="mb-2 text-sm font-medium dark:text-white">Monthly Revenue Comparison</h3>
                    {getCombinedChartData('monthlyRevenue') ? (
                      <Line 
                        data={getCombinedChartData('monthlyRevenue')} 
                        options={{ 
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            }
                          }
                        }} 
                        height={100} 
                      />
                    ) : (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <h3 className="mb-2 text-sm font-medium dark:text-white">Weekly Revenue Comparison</h3>
                  {getCombinedChartData('weeklyRevenue') ? (
                    <Bar 
                      data={getCombinedChartData('weeklyRevenue')} 
                      options={{ 
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }} 
                      height={80} 
                    />
                  ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                  )}
                </div>
              </div>

              {/* Individual Station Details */}
              <div className="mt-8 space-y-6">
                {selectedStations.map((imei) => {
                  const station = stationData[imei];
                  if (!station || station.error) return null;

                  return (
                    <div key={imei} className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{station.name}</h2>
                      
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <h3 className="mb-2 text-sm font-medium dark:text-white">Daily Revenue Trend</h3>
                          {getChartData(imei, 'dailyRevenue') ? (
                            <Line 
                              data={getChartData(imei, 'dailyRevenue')} 
                              options={{ responsive: true }} 
                              height={100} 
                            />
                          ) : (
                            <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                          )}
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <h3 className="mb-2 text-sm font-medium dark:text-white">Monthly Revenue Trend</h3>
                          {getChartData(imei, 'monthlyRevenue') ? (
                            <Line 
                              data={getChartData(imei, 'monthlyRevenue')} 
                              options={{ responsive: true }} 
                              height={100} 
                            />
                          ) : (
                            <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 mt-6 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 className="mb-2 text-sm font-medium dark:text-white">Weekly Revenue Breakdown</h3>
                        {getChartData(imei, 'weeklyRevenue') ? (
                          <Bar 
                            data={getChartData(imei, 'weeklyRevenue')} 
                            options={{ responsive: true }} 
                            height={80} 
                          />
                        ) : (
                          <div className="py-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedStations.length === 0 && !loading && (
        <div className="max-w-6xl px-4 mx-auto mt-8">
          <div className="p-8 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <FontAwesomeIcon icon={faBatteryThreeQuarters} className="mb-4 text-4xl text-gray-400 dark:text-gray-500" />
            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-white">No Stations Selected</h3>
            <p className="text-gray-600 dark:text-gray-400">Select one or more stations above to start comparing their data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationComparison;
