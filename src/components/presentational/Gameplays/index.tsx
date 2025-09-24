import {createColumnHelper } from "@tanstack/react-table"

export type GameplayCols = {
    id: BigInteger;
    gameplay_id: BigInteger;
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
}
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
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator", {
          header: "Operator",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator_endpoint", {
          header: "Operator Endpoint",
          //render the Genres component here:
          cell: (info) => info.getValue() ,
        }),
        columnHelper.accessor("operator_player_id", {
          header: "Operator Player Id",
          //use our convertToHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue()

        }),
        columnHelper.accessor("rgs_total_bet", {
          header: "RGS Total Bet",
          cell: (info) => info.getValue(),
          size:70,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("game_denomination", {
          header: "Game Den.",
          cell: (info) => info.getValue(),
          size:50,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("currency", {
          header: "Currency",
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
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("game_start_time", {
          header: "Game Start Time",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("jp", {
          header: "Jackpot",
          cell: (info) => info.getValue(),
          size: 75
        }),             
      ]