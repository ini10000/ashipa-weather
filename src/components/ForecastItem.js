import { View, Text, Image } from "react-native";
import React from "react";

import tw from "../lib/tailwind";

const ForecastItem = ({ item }) => {
  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? "am" : "pm";
      time[0] = +time[0] % 12 || 12;
    }
    const suffix = time.join("").split(":")[2].slice(2);
    const hour = time.join("").split(":")[0];
    return `${hour}${suffix}`;
  }
  return (
    <View style={tw`w-[98px] mr-8`}>
      <View
        style={tw`w-[98px] h-[98px] rounded-[10px] bg-[#2E30AD]/15 justify-center items-center mb-[8px]`}
      >
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          }}
          style={{ width: 56, height: 56 }}
        />
      </View>
      <Text
        style={tw`w-full text-center font-bold text-[18px] leading-[23px] text-[#4F4F4F] mb-5`}
      >
        {tConvert(item.dt_txt.split(" ")[1])}
      </Text>
      <Text
        style={tw`w-full text-center font-bold text-[32px] leading-[42px] text-[#2E30AD]`}
      >
        {Math.round(parseFloat(item.main.temp))}&#176;C
      </Text>
    </View>
  );
};

export default ForecastItem;
