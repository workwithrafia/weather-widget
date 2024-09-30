"use client";

import { useState,ChangeEvent,FormEvent } from "react";
import { Card ,CardHeader ,CardTitle ,CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, Divide, MapPinIcon, ThermometerIcon } from "lucide-react";



interface WeatherData {
   temperature : number ;
   location : string;
   description : string;
   unit : string
};

export default function WeathterWidjet(){
    const [location , setLocation] = useState <string> (""); 
    const [Weather ,setWeather] = useState <WeatherData | null> (null);
    const [error ,setError] = useState <string | null> (null);
    const [isLoading ,setIsLoading] = useState <boolean> (false);


    const handleSearch = async(e :FormEvent <HTMLFormElement>) =>{
        e.preventDefault();

        const trimmedLocation = location.trim();
        if(trimmedLocation === ""){
            setError("please Enter a Valid Location");
            setWeather(null);
            return;
            
        }
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
             throw new Error ("city not found.");
            }
           const data = await response.json();
           const weatherData : WeatherData ={
            temperature :data.current.temp_c,
            description : data.current.condition.text,
            location : data.location.name,
            unit : "C",
           };
           setWeather(weatherData);

        }catch(error){
            setError("city not found please try again.");
            setWeather(null);
        }finally{
            setIsLoading(false);
        }
    };

    function getTemperatureMessage (temperature : number, unit: string): string{
        if(unit == "C"){
            if(temperature < 0){
                return `It is freezing at ${temperature}℃! Bundle Up!`;
            }else if (temperature < 10){
                return `It's quite cold at ${temperature}℃, Wear Warm Clothes.`;
            }else if(temperature < 20){
                return `The Temperature is ${temperature}℃, Comfortable for a light jacket.`
            }else if (temperature < 30){
                return `It's a pleasent ${temperature}℃, Enjoy the Nice Weather.`
            }else {
                return `Its hot at ${temperature}℃. Stay hydrated!`
            }

        }else {
            return `${temperature}°${unit}`;
        }
    }
   
   function getWeatherMessage (description : string) :string{
    switch (description.toLocaleLowerCase()) {
        case "sunny":
         return "Its a beautifull sunny day!";

         case "partly cloudy":
        return "Expect some clouds and shine!";

        case "cloudy":
        return "Its's cloudy today!";

        case "overcast":
        return "The sky is overcast!";

        case "rain":
        return "Dont forget your umbrella! Its raining!";

        case "thunderstroms":
        return "Thunderstroms are expected toda!";

        case "snow":
        return "Bundle up! Its snowing!";

        case "mist":
        return "Its misty outside!";

        case "fog":
        return "Be careful,there's fog outside!";

        default :
        return description ;
    }
   }

   function getLocationMessage (location : string): string{
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour <6;
    return `${location} ${isNight ? "at night" : "During the day"}`;
   }


   return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle> Weather Widget</CardTitle>
                <CardDescription>Select for the weather conditions in your city.</CardDescription>
            </CardHeader>
            <CardContent>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                type="text"
                placeholder="Enter a city name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Search"}
                </Button>
            </form>

            {error && <div className="mt-4 text-red-500">{error}</div>}
            {Weather && (
               <div className="mt-4 grid gap-2">
                <div className="flex items-center gap-2">
                   <ThermometerIcon className="w-6 h-6" />
                   {getTemperatureMessage(Weather.temperature, Weather.unit)}
                </div>

                <div className="flex items-center gap-2">
                   <CloudIcon className="w-6 h-6" />
                   {getWeatherMessage(Weather.description)}
                </div>

                <div className="flex items-center gap-2">
                   <MapPinIcon className="w-6 h-6" />
                   {getLocationMessage(Weather.location)}
                </div>
               </div>
            )}
            </CardContent>
        </Card>
    </div>
   )
    

};

