import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, FlatList } from "react-native";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import tw from "./src/lib/tailwind";

import Back from "./assets/images/Back.png";
import Burger from "./assets/images/Burger.png";
import ForecastItem from "./src/components/ForecastItem";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=cfead38986512ca40aba0b76ac8b2bde&units=metric`;
  const [fontsLoaded] = useFonts({
    "DM-Sans": require("./assets/fonts/DMSans-Regular.ttf"),
    "DM-Sans-Bold": require("./assets/fonts/DMSans-Bold.ttf"),
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getWeatherData = async (url) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let weather = data;
        setForecastData(weather.list);
        setWeatherData(weather.list[0].main);
        setCurrentWeather(weather.list[0].weather[0]);
        setCurrentImage(
          `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
      getWeatherData(url);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (!fontsLoaded) {
    return null;
  }

  if (!currentImage) {
    return null;
  }

  return (
    <View style={tw`flex bg-[#FFFFFF] px-8`}>
      <View style={tw`flex flex-row w-full justify-between my-12 items-center`}>
        <Image source={Back} />
        <Image source={Burger} />
      </View>
      <View style={tw`flex flex-row justify-between`}>
        <View>
          <Text style={tw`font-regular text-[16px] leading-[20px] mb-6`}>
            Today
          </Text>
          <Text style={tw`font-bold text-[96px] leading-[96px] text-[#2E30AD]`}>
            {Math.round(parseFloat(weatherData.temp))}&#176;C
          </Text>
          <Text style={tw`font-bold text-[18px] leading-[23px]`}>
            {currentWeather.main}
          </Text>
          <Text
            style={tw`font-regular text-[14px] leading-[18px] text-[#4F4F4F]`}
          >
            {currentWeather.description.split(" ").map(capitalize).join(" ")}
          </Text>
        </View>
        <Image
          source={{ uri: currentImage }}
          style={{ width: 109, height: 173 }}
        />
      </View>
      <View style={tw` mt-[110px]`}>
        <FlatList
          data={forecastData}
          renderItem={({ item }) => <ForecastItem item={item} />}
          keyExtractor={(item) => item.dt}
          horizontal={true}
        />
      </View>
      <View style={tw`flex flex-row justify-between mt-[45px]`}>
        <View
          style={tw`flex flex-row justify-between items-center w-[50%] px-[25px] py-[46px] border border-[#E0E0E0]`}
        >
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>
            Pressure
          </Text>
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>|</Text>
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>
            <Text
              style={tw`font-bold text-[18px] leading-[23px]`}
            >{`${weatherData.pressure}`}</Text>
            hPa
          </Text>
        </View>
        <View
          style={tw`flex flex-row justify-between items-center w-[50%] px-[25px] py-[46px] border border-[#E0E0E0] border-l-0`}
        >
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>
            Pressure
          </Text>
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>|</Text>
          <Text style={tw`font-regular text-[18px] leading-[23px]`}>
            <Text
              style={tw`font-bold text-[18px] leading-[23px]`}
            >{`${weatherData.humidity}`}</Text>
            %
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
