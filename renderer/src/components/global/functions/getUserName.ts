import { supabase } from "@/src/utils/supabase/supabase"


const getUserName = async (user_id: string) => {
    if (supabase && user_id) {
        const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user_id)
            .single()
        if (error) {
            return "User"
        }
        if (data) {
            const name = data.first_name 
            if (name === null || name === undefined) {
                return "User"
            } else {
                return name.charAt(0).toUpperCase() + name.slice(1);
            }
        }
    } else {
        return "User"
    }
}

export default getUserName