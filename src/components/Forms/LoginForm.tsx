import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import axios from 'axios'

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

export function LoginForm() {
  const [loginToken, setLoginToken] = useState("")
  const [headers , setHeaders] = useState("")
  const [username, setUsername] = useState("")
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: true,     
    },
    onSubmit: async ({ value }) => {
        axios.post(`/testroles/auth/login`, {
            username: value.username,
            password: value.password,
            rememberMe: value.rememberMe,
        }).then(function (response) {
            localStorage.setItem("token", response.data.access_token);
        }).catch(function (error) {
            console.log(error);
        });
      // Do something with form data
    },
  })

  return (
    <div className="bg-yellow-300">
      <h1>Simple Form Example</h1>
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
            name="username"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'The username is required'
                  : value.length < 3
                    ? 'Username must be at least 5 characters'
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return (
                  value.includes('error') && 'No "error" allowed in first name'
                )
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Username:</label>
                  <input className="bg-slate-300"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div>
          <form.Field
            name="password"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Password:</label>
                <input className="bg-slate-300"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
            <form.Field
                name="rememberMe"
                children={(field) => (
                <div className="flex items-center gap-2">
                    <input
                    id="rememberMe"
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>
                )}
            />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Login'}
            </button>
          )}
        />
      </form>
    </div>
  )
}

