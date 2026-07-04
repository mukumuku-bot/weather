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

const randomZipPool = [
  "0600001",
  "9800811",
  "1000001",
  "2310002",
  "3800841",
  "4200853",
  "4500002",
  "6008216",
  "5300001",
  "6500004",
  "7000823",
  "7300011",
  "7600017",
  "7900001",
  "8100001",
  "8500874",
  "8600002",
  "8800001",
  "8920816",
  "9000014",
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
  ["100", "☀"],
  ["101", "☀☁"],
  ["102", "☀☂"],
  ["104", "☀❄"],
  ["200", "☁"],
  ["201", "☁☀"],
  ["202", "☁☂"],
  ["204", "☁❄"],
  ["300", "☂"],
  ["301", "☂☀"],
  ["302", "☂☁"],
  ["303", "☂❄"],
  ["400", "❄"],
  ["401", "❄☀"],
  ["402", "❄☁"],
  ["403", "❄☂"],
]);

const grid = document.querySelector("#weatherGrid");
const statusText = document.querySelector("#status");
const refreshButton = document.querySelector("#refreshButton");
const randomButton = document.querySelector("#randomButton");
const template = document.querySelector("#weatherCardTemplate");
const zipForm = document.querySelector("#zipForm");
const zipInput = document.querySelector("#zipInput");
const addressResult = document.querySelector("#addressResult");

let activeLocations = [...defaultCities];
let lastRandomZip = "";

function formatValue(value, suffix) {
  if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Math.round(Number(value))}${suffix}`;
}

function weatherIcon(code = "") {
  if (weatherIcons.has(code)) {
    return weatherIcons.get(code);
  }

  if (code.startsWith("1")) return "☀";
  if (code.startsWith("2")) return "☁";
  if (code.startsWith("3")) return "☂";
  if (code.startsWith("4")) return "❄";
  return "⛅";
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
    if (exact) {
      return exact;
    }
  }

  return areas[0];
}

function buildLocationFromAddress(address) {
  const office = jmaByPrefCode[address.prefcode];

  if (!office) {
    throw new Error("この住所の天気予報には対応していません。");
  }

  return {
    name: address.address2 || address.address1,
    prefecture: address.address1,
    address: `${address.address1}${address.address2}${address.address3}`,
    officeCode: office.officeCode,
  };
}

function formatZip(zip) {
  return `${zip.slice(0, 3)}-${zip.slice(3)}`;
}

function setLoading(isLoading) {
  refreshButton.disabled = isLoading;
  randomButton.disabled = isLoading;
}

function pickRandomZip() {
  if (randomZipPool.length === 1) {
    lastRandomZip = randomZipPool[0];
    return lastRandomZip;
  }

  let nextZip = lastRandomZip;
  while (nextZip === lastRandomZip) {
    nextZip = randomZipPool[Math.floor(Math.random() * randomZipPool.length)];
  }

  lastRandomZip = nextZip;
  return nextZip;
}

async function lookupAddress(zip) {
  const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
  if (!response.ok) {
    throw new Error("住所の取得に失敗しました。");
  }

  const data = await response.json();
  if (data.status !== 200 || !data.results?.length) {
    throw new Error("郵便番号に一致する住所が見つかりませんでした。");
  }

  return data.results[0];
}

async function loadLocationWeather(location) {
  const response = await fetch(buildWeatherUrl(location));
  if (!response.ok) {
    throw new Error(`${location.name}の天気を取得できませんでした。`);
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

async function refreshWeather() {
  setLoading(true);
  statusText.textContent = "天気を読み込み中です...";

  try {
    const weatherList = await Promise.all(activeLocations.map(loadLocationWeather));
    grid.replaceChildren(...weatherList.map(renderCard));
    const updatedAt = new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    statusText.textContent = `${updatedAt} に更新しました`;
  } catch (error) {
    statusText.textContent = "天気を読み込めませんでした。時間をおいて再度お試しください。";
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function searchByZip(zip, labelPrefix = "") {
  const normalizedZip = zip.replace(/\D/g, "");

  if (normalizedZip.length !== 7) {
    addressResult.textContent = "郵便番号は7桁で入力してください。";
    return;
  }

  setLoading(true);
  addressResult.textContent = "住所を検索しています...";
  statusText.textContent = "天気を読み込み中です...";

  try {
    const address = await lookupAddress(normalizedZip);
    const location = buildLocationFromAddress(address);
    activeLocations = [location];
    zipInput.value = formatZip(normalizedZip);
    addressResult.textContent = `${labelPrefix}${formatZip(normalizedZip)} ${location.address}`;
    const weatherList = await Promise.all(activeLocations.map(loadLocationWeather));
    grid.replaceChildren(...weatherList.map(renderCard));
    const updatedAt = new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    statusText.textContent = `${updatedAt} に更新しました`;
  } catch (error) {
    addressResult.textContent = error.message;
    statusText.textContent = "住所の検索に失敗しました。別の郵便番号でお試しください。";
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function showRandomLocation() {
  const randomZip = pickRandomZip();
  await searchByZip(randomZip, "ランダム: ");
}

refreshButton.addEventListener("click", refreshWeather);
randomButton.addEventListener("click", showRandomLocation);
zipInput.addEventListener("input", () => {
  const value = zipInput.value.replace(/\D/g, "").slice(0, 7);
  zipInput.value = value.length > 3 ? `${value.slice(0, 3)}-${value.slice(3)}` : value;
});
zipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchByZip(zipInput.value);
});

refreshWeather();
