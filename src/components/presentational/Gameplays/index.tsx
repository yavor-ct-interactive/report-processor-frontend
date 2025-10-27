import {createColumnHelper } from "@tanstack/react-table"
import { advancedFilter } from "../../tables/abstractTable";
import { stringFilter } from "../../tables/abstractTable";

export type GameplayCols = {
    id: BigInteger;
    gameplay_id: number;
    operator: String;
    operator_endpoint: String;
    operator_player_id: String;
    currency: String;
    game: String;
    successful_operator_win_transaction_ammount: BigInteger;
    game_start_time: Date;
    jp: BigInteger;
    added_at: Date;
    rgs_total_bet: BigInteger;
    game_denomination: BigInteger;
    setFilter: (operator:any, value:any) => void
}

/* Filters for columns RGS_Total_Bet, Win_amount */
const filterGreaterThan = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  return rowValue > filterValue;
};

const filterLessThan = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  return rowValue < filterValue;
};

const filterEqual = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  return rowValue === filterValue;
};

const columnHelper = createColumnHelper<GameplayCols>();

export const gameplay_columns = [
        columnHelper.accessor("id", {
          header: "ID",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 30, 
          maxSize: 100
        }),
        columnHelper.accessor("gameplay_id", {
          header: "Gameplay Id",
          aggregationFn: "count",
          filterFn: stringFilter,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator", {
          header: "Operator",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator_endpoint", {
          header: "Operator Endpoint",
          filterFn: stringFilter,
          //render the Genres component here:
          cell: (info) => info.getValue() ,
        }),
        columnHelper.accessor("operator_player_id", {
          header: "Operator Player Id",
          filterFn: stringFilter,
          //use our convertToHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue()

        }),
        columnHelper.accessor("rgs_total_bet", {
          header: "RGS Total Bet",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size:70,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("game_denomination", {
          header: "Game Den.",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size:50,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("currency", {
          header: "Currency",
          filterFn: stringFilter,
          cell: (info) => info.getValue(),
          size:70,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("game", {
          header: "Game",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("win_transaction_amount", {
          header: "Win Amount",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("game_start_time", {
          header: "Game Start Time",
          filterFn: (row, columnId, filterValue) => {
            const rowValue = String(row.getValue(columnId));
            return rowValue.includes(String(filterValue));
          },
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("jp", {
          header: "Jackpot",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size: 75
        }),             
      ]