'use client'

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// ** Third Party
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { signIn, useSession } from "next-auth/react"

// ** Icon
import AuthSocialButton from "./AuthSocialButton"
import { BsGithub, BsGoogle } from "react-icons/bs"

// ** Component
import Input from "@/app/components/ui/Input"
import Button from "@/app/components/ui/Button"
import toast from "react-hot-toast"


type Variant = "LOGIN" | "REGISTER"

export const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(session?.status === 'authenticated') {
      router.push("/users")
    }
  }, [session?.status])
  

  const toggleVariant = useCallback(
    () => {
      if(variant === "LOGIN") {
        setVariant('REGISTER')
      }else {
        setVariant('LOGIN');
      }
    },
    [variant],
  )

  const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async(data) => {
    setIsLoading(true);

    if(variant === "REGISTER"){
      try {
        axios.post('/api/register', data)
        .then(() => signIn('credentials', data))
        toast.success("Account has been created !!!")

      } catch (error) {
        toast.error("Something went wrong!!!")
      } finally {
        
        setIsLoading(false);
      }
    }  

    if(variant === "LOGIN"){
      // Next Auth Signin
      try {
        signIn('credentials', {
          ...data,
          redirect: false,
        })
        .then((callback) => {
          if(callback?.error){
            toast.error("invalid credentials")
          }
  
          if(callback?.ok && !callback?.error){
            toast.success("Logged in!");
            router.push("/users")
          }
        })
      } catch (error) {
        toast.error("Something went wrong!!!")
      } finally{
        setIsLoading(false);
      }
      
    }  
  }

  const socialAction = (action: string) => {
    setIsLoading(true);

    // Next Auth Social Sign in
    signIn(action, { redirect: false })
    .then((callback) => {
      if(callback?.error){
        toast.error('Invalid Credentials');
      }

      if(callback?.ok && !callback?.error){
        toast.success('Logged In');
      }
    })
    .finally(() => setIsLoading(false));
  }
  
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {
            variant === "REGISTER" && (
              <Input id="name"  label="Name"  register={register} errors={errors} disabled={isLoading} />
            )
          }

          <Input id="email"  label="Email address"  register={register} errors={errors} disabled={isLoading} />
          <Input id="password"  label="Password" type="password"  register={register} errors={errors} disabled={isLoading} />

          <div>
            <Button
              disabled={isLoading}
              fullWidth
              type="submit"
            >
              {variant === "LOGIN" ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continute with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGithub} onClick={()=> socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={()=> socialAction('google')} />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN" ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div className="underline cursor-pointer" onClick={toggleVariant}>
            {variant === "LOGIN" ? 'Sign up?' : 'Sign in'}
          </div>
        </div>
      </div>
    </div>
  )
}
