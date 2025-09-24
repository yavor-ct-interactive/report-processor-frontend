export type SystemInfoCols = {
    id: BigInteger;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_in: number;
    network_out: number;
    timestamp: Date;
}