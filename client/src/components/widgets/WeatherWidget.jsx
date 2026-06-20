import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, ThermometerSun } from 'lucide-react';

export default function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;
    
    // Extract city from location (e.g. "Mumbai, MH" -> "Mumbai")
    const city = location.split(',')[0].trim();
    
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then(res => res.json())
      .then(data => {
        const current = data.current_condition[0];
        setWeather({
          temp: current.temp_C,
          desc: current.weatherDesc[0].value,
          wind: current.windspeedKmph,
          humidity: current.humidity,
        });
      })
      .catch(err => console.error('Failed to fetch weather', err))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading || !weather) return null;

  return (
    <div className="flex items-center gap-4 bg-white/50 backdrop-blur border border-slate-100 rounded-lg px-4 py-2 mt-2 max-w-fit shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <ThermometerSun className="w-5 h-5 text-orange-500" />
        <span className="font-bold font-heading text-lg">{weather.temp}°C</span>
      </div>
      <div className="h-6 w-px bg-slate-200"></div>
      <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
        <Cloud className="w-4 h-4 text-slate-400" />
        {weather.desc}
      </div>
      <div className="h-6 w-px bg-slate-200"></div>
      <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
        <Wind className="w-4 h-4 text-slate-400" />
        {weather.wind} km/h
      </div>
    </div>
  );
}
