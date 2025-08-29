import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import axios from "axios";


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
interface PromosFormProps {
    form_data?: any, 
    onClose?: ()=> void
}
export function PromosForm({form_data, onClose}: PromosFormProps) {
  //let {id, month, start_date, end_date, promo_type, site, endpoint, endpoint_id, platform, game, 
    //game_id, category_section,position, discount_percent, fixed_discount, priority, final_invoice_discount} = form_data?.form_data ?? {}
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
  useEffect(() => {
    console.log("promos form rendered")
    if (form_data) {
      form.reset(form_data)
    }
  }, [form_data])

  const form = useForm({
    defaultValues: form_data ?? {},
    onSubmit: async ({value,formApi}) => {
        setIsLoading(true)
      // Do something with form data
        const originalValues = form_data
        const currentValues = formApi.state.values

        // Get changed values
        const changedValues: Record<string, any> = {}
        const unchangedValues: Record<string, any> = {}

        Object.keys(currentValues).forEach((key) => {
        if (currentValues[key] !== originalValues[key]) {
            changedValues[key] = currentValues[key]
        } else {
            unchangedValues[key] = currentValues[key]
        }
        })

        // Now you can use them separately:
        console.log("Changed:", changedValues)
        console.log("Unchanged:", unchangedValues)
        let id = value.id
        let headers = {
            "Content-Type":"application/json"
        }
        axios.patch(`/backend/pbi/promos/${id}`, {
            payload: { id: unchangedValues.id, changedValues: changedValues}
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
        })

    },
  })

  return (
    <div className="">        
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {form_field_defs.map((subject) => { console.log("Form Fields", subject) 
        return (
          <div key={subject.name} className="flex flex-row mb-2">
            <form.Field name={subject.name}>
              {(field) => (
                <>
                  <div className="w-1/3">
                    <label htmlFor={subject.name}>{subject.label}</label>
                  </div>
                  <div className="w-1/3">
                    <input
                      className="border"
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      type="text"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {!field.state.meta.isValid && (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  )}
                </>
              )}
            </form.Field>
          </div>
)})}
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

