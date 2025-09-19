import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import axios from "axios";
import Select, { components } from 'react-select';
import type {DropdownIndicatorProps} from 'react-select';
import dayjs from 'dayjs'
import { currentDay } from '../date_functions'
import { DateTimePicker } from '../presentational/widgets/RPDatePicker'
import { CustomSelect } from './CustomSelect'
import { get_endpoints_url, get_operators_url, get_platforms_url } from "../presentational/Sysinfo/Functions"
import { get_operator_url } from '../presentational/Sysinfo/Functions'


function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
interface NewPromosFormProps {
    onClose?: ()=> void
}
export function NewPromosForm({onClose}: NewPromosFormProps) {
    const [month, setMonth] = useState("January")
    const {start, end}:{start: Date, end:Date} = currentDay()
    const [startDate, setStartDate] = useState<Date>(start)
    const [endDate, setEndDate] = useState<Date>(end)

    let form_field_defs = [ 
        {name:"month", label: "Month" }, 
        {name: "start_date", label: "Start Date"},
        {name: "end_date", label: "End Date"},
        {name: "promo_type", label: "Promo Type"},
        {name: "site", label: "Site"},
        {name: "endpoint", label: "Endpoint"},
        {name: "endpoint_id", label: "Endpoint ID"},
        {name: "platform", label: "platform"},
        {name: "game", label: "game" },
        {name: "game_id", label: "game ID" },
        {name: "category_section", label: "Category Section" },
        {name: "position", label: "Position" },                                    
        {name: "discount_percent", label: "Fixed Discount" },
        {name: "priority", label: "Priority"},
        {name: "final_invoice_discount", label: "Final Invoice Discount"},  
    ]

  const [isLoading, setIsLoading] = useState(false)



  const form = useForm({
    defaultValues: {
    month: '',
    start_date: '',
    end_date: '',
    promo_type: '',
    operator: '',
    site: '',
    endpoint: '',
    endpoint_id: '',
    platform: 0,
    game: '',
    game_id: '',
    category_section: '',
    position: '',
    discount_percent: '',
    priority: '',
    final_invoice_discount: ''
  },
    onSubmit: async ({value}) => {
        setIsLoading(true)    
        let headers = {
            "Content-Type":"application/json"
        }
        console.log("Values from form",value)
        /*axios.post(`/backend/pbi/promos`, {
            payload: value,
        }, {
            headers: headers
        }).then ( (res) => {
            console.log(res)
            setIsLoading(false)
            if (onClose) onClose();
        }).catch ( (error) =>{
            console.log(error)
            setIsLoading(false)
            if (onClose) onClose();
        })*/

    },
  })

  interface ColourOption {
     readonly value: string;
     readonly label: string;
     readonly color: string;
     readonly isFixed?: boolean;
     readonly isDisabled?: boolean;
}

 const monthsOptions: readonly ColourOption[] = [
  { value: 'january', label: 'January', color: '#00B8D9'},
  { value: 'february', label: 'February', color: '#070707ff' },
  { value: 'march', label: 'March', color: '#5243AA' },
  { value: 'april', label: 'April', color: '#FF5630' },
  { value: 'may', label: 'May', color: '#FF8B00' },
  { value: 'june', label: 'June', color: '#FFC400' },
  { value: 'july', label: 'July', color: '#36B37E' },
  { value: 'august', label: 'August', color: '#00875A' },
  { value: 'september', label: 'September', color: '#253858' },
  { value: 'october', label: 'October', color: '#666666' },
  { value: 'november', label: 'November', color: '#666666' },
  { value: 'december', label: 'December', color: '#666666' },
];
  const handleMonthChange = (e) =>{
    setMonth(e.value)
  }

  return (
    <div className="">        
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="month"
            validators={{
              onChange: ({ value }) =>
                console.log("Month value is", value)
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Month:</label>
                  <Select
                    defaultValue={monthsOptions[0]}
                    closeMenuOnSelect={true}
                    options={monthsOptions}
                    onChange={(e)=>{console.log(e.value)}}
                  />
                  
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div className="z-102">
          {/* A type-safe field component*/}
          <form.Field
            name="start_date"
            validators={{
              onChange: ({ value }) =>
                console.log("Value from start_date is ", value)
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Start Date:</label>
                  
                  <DateTimePicker start_date ={startDate} onChange={(date) => {field.handleChange(date)}} />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div className='z-101'>
          {/* A type-safe field component*/}
          <form.Field
            name="end_date"
            validators={{
              onChange: ({ value }) =>
                console.log("Value from end_date is ", value)
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>End Date:</label>
                  
                  <DateTimePicker start_date ={startDate} onChange={(date) => {field.handleChange(date)}} />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div className='z-103'>
          {/* A type-safe field component*/}
          <form.Field
            name="platform"
            validators={{
              onChange: ({ value }) =>
                console.log(value)
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Platform:</label>
                 <CustomSelect url={get_platforms_url} value={field.state.value} onChange={(e)=>field.handleChange(e.value)} 
                          queryKey={["platform"]}/>
                 <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div>
        <form.Field name="operator">
            {(field) => (
              <>
                <label htmlFor={field.name}>Operator:</label>

                <form.Subscribe
                  selector={(state) => ( {
                    platform: state.values.platform
                  })
                } // <-- pick the field you want to watch
                >
                  {(platform) => {
                    console.log(platform.platform)
                    const operator_url = get_operator_url(platform.platform)
                  return( 
                    <>
                    {platform.platform ?
                    <CustomSelect url={operator_url} 
                                  value={field.state.value} 
                                  onChange={(e)=>field.handleChange(e.value) } 
                                  queryKey={["operator",platform]} /> :
                                  <Select isDisabled={true} />
                    }
                    </>

                  )}}
                </form.Subscribe>

                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
        <form.Field name="endpoint">
            {(field) => (
              <>
                <label htmlFor={field.name}>Endpoint:</label>

                <form.Subscribe
                  selector={(state) => ( {
                    operator: state.values.operator
                  })
                } // <-- pick the field you want to watch
                >
                  {(operator) => {

                    console.log(operator.operator)
                    const endpoints_url  = get_endpoints_url(operator.operator)
                  return(
                    <>
                    {operator.operator ? 
                    <CustomSelect url={endpoints_url} 
                                  value={field.state.value} 
                                  onChange={(e)=>field.handleChange(e.value) } 
                                  queryKey={["endpoint",operator]} /> :
                                  <Select isDisabled={true} />
                                  }
                    </>
                  )}}
                </form.Subscribe>

                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] }
          children={([canSubmit, isSubmitting]) => (
            <div className="flex flex-row">
                <button type="submit" disabled={!canSubmit} className="w-1/3">
                {isSubmitting ? '...' : 'Submit'}
                </button>
                <div className="w-1/3">
                    {isLoading ? <FaSpinner className="animate-spin text-blue-500 text-4xl" /> : ''}
                </div>
            </div>
            
          )}
        />
        
      </form>
    </div>
  )
}

