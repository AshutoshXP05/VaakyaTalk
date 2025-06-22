import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api"


function useAuthUser() {

const authUser = useQuery({
    queryKey: ["authUser"],

    queryFn: getAuthUser,
    retry: false, // console error single time 
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user
  }

}

export default useAuthUser