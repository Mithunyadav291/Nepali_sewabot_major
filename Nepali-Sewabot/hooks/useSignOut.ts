import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";


export const useSignOut=()=>{
    const {signOut}=useClerk()

    const handleSignOut=()=>{
        
       Alert.alert(
    "खाता बन्द गर्नुहोस्", 
    "के तपाईं आफ्नो खाताबाट बाहिरिन चाहनुहुन्छ?", 
    [
        {
            text: "रद्द गर्नुहोस्", 
            style: "cancel"
        },
        {
            text: "बाहिरिनुहोस्",
            style: "destructive",
            onPress: () => signOut()
        }
    ]
);

    }

    return {handleSignOut};
}