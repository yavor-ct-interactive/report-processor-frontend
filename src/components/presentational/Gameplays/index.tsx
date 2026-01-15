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
    multiplier: number;
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
          minSize: 50, 
          maxSize: 50
        }),
        columnHelper.accessor("gameplay_id", {
          header: "Gameplay_ID",
          aggregationFn: "count",
          filterFn: stringFilter,
          cell: (info) => info.getValue(),
          size: 120,
          minSize: 120,
          maxSize: 120,
          enableResizing: true,
        }),
        columnHelper.accessor("operator", {
          header: "Operator",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          enableResizing: false,
          size: 170,
          minSize: 170,
          maxSize: 170,
        }),
        columnHelper.accessor("operator_endpoint", {
          header: "Endpoint",
          filterFn: stringFilter,
          //render the Genres component here:
          cell: (info) => info.getValue() ,
          size: 170,
          minSize: 170,
          maxSize: 170,
        }),
        columnHelper.accessor("operator_player_id", {
          header: "Player_ID",
          filterFn: stringFilter,
          //use our convertToHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue(),
          size: 200,
          minSize: 200,
          maxSize: 300,

        }),
        columnHelper.accessor("rgs_total_bet", {
          header: "TB",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size: 70,
          minSize: 70, 
          maxSize: 70,
        }), 
        columnHelper.accessor("game_denomination", {
          header: "DEN",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size:70,
          minSize: 70, 
          maxSize: 70,
        }), 
        columnHelper.accessor("currency", {
          header: "CCY",
          filterFn: stringFilter,
          cell: (info) => info.getValue(),
          size:70,
          minSize: 70, 
          maxSize: 70,
        }), 
        columnHelper.accessor("game", {
          header: "Game",
          cell: (info) => info.getValue(),
          size: 120,
          minSize: 120,
          maxSize: 120,
        }),   
        columnHelper.accessor("win_transaction_amount", {
          header: "Win",
          filterFn: advancedFilter,
          cell: (info) => info.getValue(),
          size: 120,
          minSize: 120,
          maxSize: 120,
        }),   
        columnHelper.accessor((row) => {
          // Logic: Win Amount / Total Bet
          const win = row.win_transaction_amount || 0;
          const bet = row.rgs_total_bet || 0;
          
          // Prevent division by zero
          return bet !== 0 ? (win / bet) : 0;
        }, {
          id: "multiplier", // 'id' is required when using accessorFn
          header: "Multiplier",
          filterFn: advancedFilter, 
          cell: (info) => {
            const val = info.getValue();
            // Optional: Format to 2 decimal places with an 'x' suffix
            return `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
          },
          size: 120, 
          minSize: 120, 
          maxSize: 120, 
        }),
        columnHelper.accessor("game_start_time", {
          header: "Game_Start_Time",
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
          size: 120,
          minSize: 120,
          maxSize: 120,
        }),             
      ]