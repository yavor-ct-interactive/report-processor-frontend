import { useQuery } from "@tanstack/react-query"
import { getData } from "../Functions"
import { service_url } from "../Functions"

export const ServiceLogs = ({service_name}) => {
    const {data, isSuccess, error, isPending} = useQuery({
        queryKey: ['service_logs', service_name],
        queryFn: () => getData({data_url: service_url(service_name)}),
    })
    const IsLoading = () =>{
        if (isPending) return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }
    const IsError = () => {
        if (error){
            return (
                <div>
                    {error.message}
                </div>
            )
        }
    }
    const IsSuccess = () => {
        if (isSuccess){
            return (
                <div>
                    <div className="text-3xl mt-2 mb-2 text-center">Service Logs for {data.service}</div>
                    {data.logs.map( (item,index) => {
                        return (
                            <div key={index}>
                                {item}
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
    return (
        <div>
            <IsLoading />
            <IsError />
            <IsSuccess />
        </div>
    )
}