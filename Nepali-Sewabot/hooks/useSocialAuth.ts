import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";


export const useSocialAuth=()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [strategyType, setStategyType] = useState("");
    const {startSSOFlow}=useSSO();
    

    const handleSocialAuth=async(strategy:"oauth_google"  | "oauth_apple" | "oauth_facebook" | "oauth_github")=>{
        setIsLoading(true)
        setStategyType(strategy)
        try {
            const {createdSessionId,setActive}=await startSSOFlow({strategy})
            if(createdSessionId && setActive){
                await setActive({session:createdSessionId})
                // router.replace("/(tabs)")
            }
        } catch (error) {
            console.log("Error in social Auth ",error)
            const provider=strategy==="oauth_google" ? "Google" :"Apple"
            Alert.alert("Error", `Failed to sign with ${provider}. Please try again`)
        }finally{
            setIsLoading(false)
        }
    }

    return {isLoading, handleSocialAuth,strategyType}
}

