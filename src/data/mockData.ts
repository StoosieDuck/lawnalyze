export const mockLawnData = {
  healthScore: 92,
  status: "Optimal",
  moistureLevel: 68,
  nutrientLevel: 85,
  phLevel: 6.8,
  nextWatering: "Today, 6:00 PM",
  recentActivities: [
    { title: "Watered", date: "Yesterday", icon: "water" },
    { title: "Fertilized", date: "Last week", icon: "leaf" },
    { title: "Mowed", date: "2 weeks ago", icon: "scissors" },
  ],
  forecast: [
    { day: "Mon", temp: 75, chanceOfRain: 10 },
    { day: "Tue", temp: 78, chanceOfRain: 20 },
    { day: "Wed", temp: 72, chanceOfRain: 60 },
    { day: "Thu", temp: 68, chanceOfRain: 80 },
    { day: "Fri", temp: 70, chanceOfRain: 30 },
  ],
};
