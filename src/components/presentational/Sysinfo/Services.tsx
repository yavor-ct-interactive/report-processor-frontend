import { useQuery } from "@tanstack/react-query"
import { getData } from "./Functions"
import { services_url } from "./Functions"
import {service_url} from "./Functions"
import { RPCard } from "../RPCard"
import { useState } from "react"
import { ServiceLogs } from "./widgets/ServiceLogs"

export const SystemServices = ({action}) => {
    const [serviceName, setServiceName] = useState("report-server")
    const [serviceUrl, setServiceUrl] = useState(null)
    const {data, isSuccess, error, isPending} = useQuery( {
        queryKey: ['services'],
        queryFn: () => getData({data_url:services_url}),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    })

    const actionFn = (e:any) => {
       let url = service_url(e)
       setServiceName(e)
       setServiceUrl(url)
    }

    return (
        <div>
            <div className="w-92 mt-3 ">
                <div className="w-full p-3 hover:shadow-lg dark:hover:shadow-teal-900 border border-gray-200">
                    {isSuccess && data.map( (item) => {
                            return (
                                <div key={item.service_name} className="flex flex-row gap-4">                                
                                    <div className="w-64">{item.service_name}</div>
                                    <div className={item.status == "active" ? "w-16 bg-green-500 text-black text-center" : "w-16 bg-red-500 text-black text-center"}>{item.status}</div>
                                    <div className="cursor-pointer hover:bg-yellow-300" onClick={()=>{actionFn(item.service_name)}}>Logs</div>
                                </div>
                            )
                    })}
                </div>
            </div>
            <ServiceLogs service_name={serviceName} />
        </div>
    )
}