const defaultCities = [
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

const jmaByPrefCode = {
  "01": { officeCode: "016000" },
  "02": { officeCode: "020000" },
  "03": { officeCode: "030000" },
  "04": { officeCode: "040000" },
  "05": { officeCode: "050000" },
  "06": { officeCode: "060000" },
  "07": { officeCode: "070000" },
  "08": { officeCode: "080000" },
  "09": { officeCode: "090000" },
  "10": { officeCode: "100000" },
  "11": { officeCode: "110000" },
  "12": { officeCode: "120000" },
  "13": { officeCode: "130000" },
  "14": { officeCode: "140000" },
  "15": { officeCode: "150000" },
  "16": { officeCode: "160000" },
  "17": { officeCode: "170000" },
  "18": { officeCode: "180000" },
  "19": { officeCode: "190000" },
  "20": { officeCode: "200000" },
  "21": { officeCode: "210000" },
  "22": { officeCode: "220000" },
  "23": { officeCode: "230000" },
  "24": { officeCode: "240000" },
  "25": { officeCode: "250000" },
  "26": { officeCode: "260000" },
  "27": { officeCode: "270000" },
  "28": { officeCode: "280000" },
  "29": { officeCode: "290000" },
  "30": { officeCode: "300000" },
  "31": { officeCode: "310000" },
  "32": { officeCode: "320000" },
  "33": { officeCode: "330000" },
  "34": { officeCode: "340000" },
  "35": { officeCode: "350000" },
  "36": { officeCode: "360000" },
  "37": { officeCode: "370000" },
  "38": { officeCode: "380000" },
  "39": { officeCode: "390000" },
  "40": { officeCode: "400000" },
  "41": { officeCode: "410000" },
  "42": { officeCode: "420000" },
  "43": { officeCode: "430000" },
  "44": { officeCode: "440000" },
  "45": { officeCode: "450000" },
  "46": { officeCode: "460100" },
  "47": { officeCode: "471000" },
};

const weatherIcons = new Map([
  ["100", "☀️"], ["101", "🌤️"], ["102", "🌦️"], ["103", "🌦️"], ["104", "🌨️"],
  ["110", "🌤️"], ["111", "🌤️"], ["112", "🌦️"], ["113", "🌦️"], ["114", "🌧️"],
  ["115", "🌨️"], ["116", "🌨️"], ["117", "🌨️"], ["118", "🌧️"], ["119", "🌦️"],
  ["120", "🌦️"], ["121", "🌦️"], ["122", "🌦️"], ["123", "🌤️"], ["124", "🌤️"],
  ["125", "🌦️"], ["126", "🌦️"], ["127", "🌦️"], ["128", "🌦️"], ["130", "🌤️"],
  ["131", "🌤️"], ["132", "🌤️"], ["140", "🌦️"], ["160", "🌨️"], ["170", "🌨️"],
  ["181", "🌨️"], ["200", "☁️"], ["201", "⛅"], ["202", "🌦️"], ["203", "🌦️"],
  ["204", "🌨️"], ["205", "🌨️"], ["206", "🌨️"], ["207", "🌨️"], ["208", "🌨️"],
  ["209", "🌫️"], ["210", "⛅"], ["211", "⛅"], ["212", "🌦️"], ["213", "🌦️"],
  ["214", "🌧️"], ["215", "🌨️"], ["216", "🌨️"], ["217", "🌨️"], ["218", "🌧️"],
  ["219", "🌦️"], ["220", "🌦️"], ["221", "🌦️"], ["222", "🌦️"], ["223", "⛅"],
  ["224", "🌦️"], ["225", "🌦️"], ["226", "🌦️"], ["227", "🌦️"], ["228", "🌨️"],
  ["229", "🌨️"], ["230", "🌨️"], ["231", "☁️"], ["240", "⛈️"], ["250", "🌨️"],
  ["260", "🌨️"], ["270", "🌨️"], ["281", "🌨️"], ["300", "🌧️"], ["301", "🌦️"],
  ["302", "🌦️"], ["303", "🌨️"], ["304", "🌨️"], ["306", "🌧️"], ["308", "🌧️"],
  ["309", "🌧️"], ["311", "🌦️"], ["313", "🌦️"], ["314", "🌧️"], ["315", "🌨️"],
  ["316", "🌨️"], ["317", "🌨️"], ["320", "🌦️"], ["321", "🌦️"], ["322", "🌨️"],
  ["323", "🌦️"], ["324", "🌦️"], ["325", "🌦️"], ["326", "🌨️"], ["327", "🌨️"],
  ["328", "🌧️"], ["329", "🌧️"], ["340", "🌨️"], ["350", "🌧️"], ["361", "🌨️"],
  ["371", "🌨️"], ["400", "🌨️"], ["401", "🌨️"], ["402", "🌨️"], ["403", "🌨️"],
  ["405", "🌨️"], ["406", "🌨️"], ["407", "🌨️"], ["409", "🌨️"], ["411", "🌨️"],
  ["413", "🌨️"], ["414", "🌨️"], ["420", "🌨️"], ["421", "🌨️"], ["422", "🌨️"],
  ["423", "🌨️"], ["425", "🌨️"], ["426", "🌨️"], ["427", "🌨️"], ["450", "🌨️"],
]);

const grid = document.querySelector("#weatherGrid");
const statusText = document.querySelector("#status");
const refreshButton = document.querySelector("#refreshButton");
const template = document.querySelector("#weatherCardTemplate");
const zipForm = document.querySelector("#zipForm");
const zipInput = document.querySelector("#zipInput");
const addressResult = document.querySelector("#addressResult");
const secretValue = document.querySelector("#secretValue");
const securityAlert = document.querySelector("#securityAlert");

let activeLocations = [...defaultCities];

function formatValue(value, suffix) {
  if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Math.round(Number(value))}${suffix}`;
}

function weatherIcon(code) {
  return weatherIcons.get(code) ?? "🌡️";
}

function buildWeatherUrl(location) {
  return `https://www.jma.go.jp/bosai/forecast/data/forecast/${location.officeCode}.json`;
}

function cleanForecastText(text = "") {
  return text.replace(/\s+/g, " ").replace(/　+/g, " ").trim();
}

function temperatureRange(temps = []) {
  const todayMax = temps[0] || temps[1];
  const todayMin = temps[1] || temps[0];
  const tomorrowMin = temps[2];
  const tomorrowMax = temps[3];

  return {
    current: todayMax,
    today: `${formatValue(todayMin, "°")} / ${formatValue(todayMax, "°")}`,
    tomorrow: `${formatValue(tomorrowMin, "°")} / ${formatValue(tomorrowMax, "°")}`,
  };
}

function findArea(areas, code) {
  if (code) {
    const exact = areas.find((item) => item.area.code === code);
    if (exact) return exact;
  }

  return areas[0];
}

function buildLocationFromForecast(address) {
  const office = jmaByPrefCode[address.prefcode];

  if (!office) {
    throw new Error("この地域の天気予報に対応していません");
  }

  return {
    name: address.address2 || address.address1,
    prefecture: address.address1,
    address: `${address.address1}${address.address2}${address.address3}`,
    officeCode: office.officeCode,
  };
}

async function lookupAddress(zip) {
  const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
  if (!response.ok) {
    throw new Error("住所を検索できませんでした");
  }

  const data = await response.json();
  if (data.status !== 200 || !data.results?.length) {
    throw new Error("郵便番号に一致する住所が見つかりませんでした");
  }

  return data.results[0];
}

async function loadLocationWeather(location) {
  const response = await fetch(buildWeatherUrl(location));
  if (!response.ok) {
    throw new Error(`${location.name}の天気を取得できませんでした`);
  }

  const data = await response.json();
  const today = data[0];
  const weatherArea = findArea(today.timeSeries[0].areas, location.weatherAreaCode);
  const rainArea = findArea(today.timeSeries[1].areas, weatherArea.area.code);
  const tempArea = findArea(today.timeSeries[2].areas, location.tempAreaCode);
  const temps = temperatureRange(tempArea.temps);

  return {
    ...location,
    name: location.name || weatherArea.area.name,
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
  node.querySelector(".prefecture").textContent = weather.address || weather.prefecture;
  node.querySelector("h2").textContent = weather.name;
  node.querySelector(".weather-icon").textContent = weather.icon;
  node.querySelector(".temperature-value").textContent = formatValue(weather.temperature, "").replace("--", "-");
  node.querySelector(".description").textContent = weather.label;
  node.querySelector(".today-temp").textContent = weather.todayTemp;
  node.querySelector(".rain-probability").textContent = formatValue(weather.rainProbability, "%");
  node.querySelector(".tomorrow-temp").textContent = weather.tomorrowTemp;
  node.querySelector(".wind").textContent = weather.wind;
  return node;
}

async function loadMaskedSecret() {
  if (!secretValue) return;
  secretValue.textContent = "これはダミーです";
}

function showSecurityWarning() {
  if (!securityAlert) return;

  securityAlert.hidden = false;
  securityAlert.scrollIntoView({ behavior: "smooth", block: "center" });
}

function containsSecretProbe(text) {
  const decoded = decodeURIComponent(text || "").toLowerCase();
  return [
    "aikotoba",
    "合言葉",
    "secret",
    "password",
    "token",
    "key",
    "credential",
    "private",
    "秘密",
  ].some((word) => decoded.includes(word.toLowerCase()));
}

function watchForSecretProbes() {
  if (containsSecretProbe(`${window.location.search} ${window.location.hash}`)) {
    showSecurityWarning();
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isDeveloperShortcut =
      key === "f12" ||
      (event.ctrlKey && key === "u") ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key));

    if (isDeveloperShortcut) {
      showSecurityWarning();
    }
  });
}

async function refreshWeather() {
  refreshButton.disabled = true;
  statusText.textContent = "天気を読み込んでいます...";

  try {
    const weatherList = await Promise.all(activeLocations.map(loadLocationWeather));
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

async function searchByZip(zip) {
  const normalizedZip = zip.replace(/\D/g, "");

  if (normalizedZip.length !== 7) {
    addressResult.textContent = "郵便番号は7桁で入力してください。";
    return;
  }

  addressResult.textContent = "住所を検索しています...";
  statusText.textContent = "天気を読み込んでいます...";

  try {
    const address = await lookupAddress(normalizedZip);
    const location = buildLocationFromForecast(address);
    activeLocations = [location];
    addressResult.textContent = `〒${normalizedZip.slice(0, 3)}-${normalizedZip.slice(3)} ${location.address}`;
    await refreshWeather();
  } catch (error) {
    addressResult.textContent = error.message;
    statusText.textContent = "郵便番号を確認して、もう一度検索してください。";
    console.error(error);
  }
}

refreshButton.addEventListener("click", refreshWeather);
zipInput.addEventListener("input", () => {
  const value = zipInput.value.replace(/\D/g, "").slice(0, 7);
  zipInput.value = value.length > 3 ? `${value.slice(0, 3)}-${value.slice(3)}` : value;
});
zipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchByZip(zipInput.value);
});

refreshWeather();
loadMaskedSecret();
watchForSecretProbes();
