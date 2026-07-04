const cities = [
  {
    name: "高松",
    prefecture: "香川県",
    officeCode: "370000",
    weatherAreaCode: "370000",
    tempAreaCode: "72086",
  },
  {
    name: "東京",
    prefecture: "東京都",
    officeCode: "130000",
    weatherAreaCode: "130010",
    tempAreaCode: "44132",
  },
];

const weatherLabels = new Map([
  ["100", "☀️"],
  ["101", "🌤️"],
  ["102", "🌦️"],
  ["103", "🌦️"],
  ["104", "🌨️"],
  ["110", "🌤️"],
  ["111", "🌤️"],
  ["112", "🌦️"],
  ["113", "🌦️"],
  ["114", "🌧️"],
  ["115", "🌨️"],
  ["116", "🌨️"],
  ["117", "🌨️"],
  ["118", "🌧️"],
  ["119", "🌦️"],
  ["120", "🌦️"],
  ["121", "🌦️"],
  ["122", "🌦️"],
  ["123", "🌤️"],
  ["124", "🌤️"],
  ["125", "🌦️"],
  ["126", "🌦️"],
  ["127", "🌦️"],
  ["128", "🌦️"],
  ["130", "🌤️"],
  ["131", "🌤️"],
  ["132", "🌤️"],
  ["140", "🌦️"],
  ["160", "🌨️"],
  ["170", "🌨️"],
  ["181", "🌨️"],
  ["200", "☁️"],
  ["201", "⛅"],
  ["202", "🌦️"],
  ["203", "🌦️"],
  ["204", "🌨️"],
  ["205", "🌨️"],
  ["206", "🌨️"],
  ["207", "🌨️"],
  ["208", "🌨️"],
  ["209", "🌫️"],
  ["210", "⛅"],
  ["211", "⛅"],
  ["212", "🌦️"],
  ["213", "🌦️"],
  ["214", "🌧️"],
  ["215", "🌨️"],
  ["216", "🌨️"],
  ["217", "🌨️"],
  ["218", "🌧️"],
  ["219", "🌦️"],
  ["220", "🌦️"],
  ["221", "🌦️"],
  ["222", "🌦️"],
  ["223", "⛅"],
  ["224", "🌦️"],
  ["225", "🌦️"],
  ["226", "🌦️"],
  ["227", "🌦️"],
  ["228", "🌨️"],
  ["229", "🌨️"],
  ["230", "🌨️"],
  ["231", "☁️"],
  ["240", "⛈️"],
  ["250", "🌨️"],
  ["260", "🌨️"],
  ["270", "🌨️"],
  ["281", "🌨️"],
  ["300", "🌧️"],
  ["301", "🌦️"],
  ["302", "🌦️"],
  ["303", "🌨️"],
  ["304", "🌨️"],
  ["306", "🌧️"],
  ["308", "🌧️"],
  ["309", "🌧️"],
  ["311", "🌦️"],
  ["313", "🌦️"],
  ["314", "🌧️"],
  ["315", "🌨️"],
  ["316", "🌨️"],
  ["317", "🌨️"],
  ["320", "🌦️"],
  ["321", "🌦️"],
  ["322", "🌨️"],
  ["323", "🌦️"],
  ["324", "🌦️"],
  ["325", "🌦️"],
  ["326", "🌨️"],
  ["327", "🌨️"],
  ["328", "🌧️"],
  ["329", "🌧️"],
  ["340", "🌨️"],
  ["350", "🌧️"],
  ["361", "🌨️"],
  ["371", "🌨️"],
  ["400", "🌨️"],
  ["401", "🌨️"],
  ["402", "🌨️"],
  ["403", "🌨️"],
  ["405", "🌨️"],
  ["406", "🌨️"],
  ["407", "🌨️"],
  ["409", "🌨️"],
  ["411", "🌨️"],
  ["413", "🌨️"],
  ["414", "🌨️"],
  ["420", "🌨️"],
  ["421", "🌨️"],
  ["422", "🌨️"],
  ["423", "🌨️"],
  ["425", "🌨️"],
  ["426", "🌨️"],
  ["427", "🌨️"],
  ["450", "🌨️"],
]);

const grid = document.querySelector("#weatherGrid");
const statusText = document.querySelector("#status");
const refreshButton = document.querySelector("#refreshButton");
const template = document.querySelector("#weatherCardTemplate");

function formatValue(value, suffix) {
  if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Math.round(Number(value))}${suffix}`;
}

function weatherIcon(code) {
  return weatherLabels.get(code) ?? "🌡️";
}

function buildWeatherUrl(city) {
  return `https://www.jma.go.jp/bosai/forecast/data/forecast/${city.officeCode}.json`;
}

function findArea(areas, code) {
  return areas.find((item) => item.area.code === code) ?? areas[0];
}

function cleanForecastText(text) {
  return text.replace(/\s+/g, " ").replace(/　+/g, " ").trim();
}

function temperatureRange(temps) {
  const todayMin = temps[1] || temps[0];
  const tomorrowMin = temps[2];
  const tomorrowMax = temps[3];

  return {
    current: temps[0],
    today: `${formatValue(todayMin, "°")} / ${formatValue(temps[0], "°")}`,
    tomorrow: `${formatValue(tomorrowMin, "°")} / ${formatValue(tomorrowMax, "°")}`,
  };
}

async function loadCityWeather(city) {
  const response = await fetch(buildWeatherUrl(city));
  if (!response.ok) {
    throw new Error(`${city.name}の天気を取得できませんでした`);
  }

  const data = await response.json();
  const today = data[0];
  const weatherArea = findArea(today.timeSeries[0].areas, city.weatherAreaCode);
  const rainArea = findArea(today.timeSeries[1].areas, city.weatherAreaCode);
  const tempArea = findArea(today.timeSeries[2].areas, city.tempAreaCode);
  const temps = temperatureRange(tempArea.temps);

  return {
    ...city,
    label: cleanForecastText(weatherArea.weathers[0]),
    icon: weatherIcon(weatherArea.weatherCodes[0]),
    temperature: temps.current,
    todayTemp: temps.today,
    tomorrowTemp: temps.tomorrow,
    wind: cleanForecastText(weatherArea.winds[0]),
    rainProbability: rainArea.pops.find((value) => value !== "") ?? "",
    reportDatetime: today.reportDatetime,
  };
}

function renderCard(weather) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".prefecture").textContent = weather.prefecture;
  node.querySelector("h2").textContent = weather.name;
  node.querySelector(".weather-icon").textContent = weather.icon;
  node.querySelector(".temperature-value").textContent = Math.round(weather.temperature);
  node.querySelector(".description").textContent = weather.label;
  node.querySelector(".feels-like").textContent = weather.todayTemp;
  node.querySelector(".rain-probability").textContent = formatValue(weather.rainProbability, "%");
  node.querySelector(".humidity").textContent = weather.tomorrowTemp;
  node.querySelector(".wind").textContent = weather.wind;
  return node;
}

async function refreshWeather() {
  refreshButton.disabled = true;
  statusText.textContent = "天気を読み込んでいます...";

  try {
    const weatherList = await Promise.all(cities.map(loadCityWeather));
    grid.replaceChildren(...weatherList.map(renderCard));
    const updatedAt = new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    statusText.textContent = `${updatedAt} に更新しました`;
  } catch (error) {
    statusText.textContent = "天気を読み込めませんでした。少し時間をおいて更新してください。";
    console.error(error);
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", refreshWeather);
refreshWeather();
