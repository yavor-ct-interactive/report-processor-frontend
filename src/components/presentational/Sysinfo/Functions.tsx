import axios from "axios"
export const base_url = "/backend"
export const sysinfo_url:string = `${base_url}/sysinfo/system-info`
export const network_connections_url:string = `${base_url}/sysinfo/network-connections`
export const services_url:string = `${base_url}/sysinfo/services-status`
export const get_platforms_url = `${base_url}/pbi/platforms`
export const get_operators_url = `${base_url}/pbi/operators`

export const service_url = (service: string): string => {
    return `${base_url}/sysinfo/service_logs/${service}`
}
export const get_operator_url = (platform_id: number): string => {
    return `${base_url}/pbi/operator/${platform_id}`
}
export const get_endpoints_url = (operator_id: number): string => {
    return `${base_url}/pbi/endpoint/${operator_id}`
}
export const getData = async ({data_url}:{data_url:string}) => {
  const { data } = await axios.get(data_url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  //console.log("GetData function returned:",data)
  return data
}

export const postData = async ({data_url}:{data_url: string}) => {
    const formData = new FormData()
    const {data} = await axios.post(data_url, formData)
    return {data}
}