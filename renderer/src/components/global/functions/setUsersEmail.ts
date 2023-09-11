import { supabase } from "@/src/utils/supabase/supabase"

const setUsersEmail = (user_id: string, email: string) => {
    if (supabase) {
        supabase
            .from('profiles')
            .update({ email })
            .eq('id', user_id)
            .then(response => {
                if (response.error) {
                    console.error(response.error)
                }
            })
    }
}

export default setUsersEmail;