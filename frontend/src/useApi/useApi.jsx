import axios from "axios";

const useApi = axios.create(
    {
        baseURL: "https://api.arkia.local/api"
    }
  );

export default useApi