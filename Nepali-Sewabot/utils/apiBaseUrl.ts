// for install expo-constants --> npx expo install expo-constants
// for install  * as Device ==> npx expo install expo-device



import {Platform} from 'react-native'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import axios from 'axios';

export const getBaseUrl=()=>{
    if(Platform.OS==='android' && !Device.isDevice){
        // console.log("Using AVD emulator → 10.0.2.2");
         return 'http://10.0.2.2:3000/api';
    }

     const debuggerHost =
    Constants.expoConfig?.hostUri?.split(':')[0] ||
    Constants.manifest2?.extra?.hostUri?.split(':')[0];

    if (debuggerHost) {
    // console.log(`Using host IP from Expo debugger: ${debuggerHost}`);
    return `http://${debuggerHost}:3001/api`;
  }
  // console.warn("No debuggerHost found. Falling back to localhost.");
  return 'http://localhost:3001/api';
}


const axiosInstance = axios.create({
  // baseURL: getBaseUrl() ,
  baseURL: "https://nepali-sewabot-api.onrender.com/api",
  withCredentials: true,
  timeout: 10000,
});

export default axiosInstance;