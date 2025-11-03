import { createTheme } from "flowbite-react";

export const CustomModalTheme = createTheme({
        modal: {
          root: {
            base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            
          },
          header: {
            base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600 text-center",
            title: "text-blue-600 text-xl font-medium text-gray-900 dark:text-white w-full text-center ",
            close:{
              base: "p-0 hover:bg-neutral-100 dark:hover:bg-teal-900",
              icon: "w-7 h-7",
            }
          },
          
        },
      });

