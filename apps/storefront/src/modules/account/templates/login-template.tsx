"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

interface LoginTemplateProps {
  countryCode?: string
}

const LoginTemplate = ({ countryCode }: LoginTemplateProps) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} countryCode={countryCode} />
      ) : (
        <Register setCurrentView={setCurrentView} countryCode={countryCode} />
      )}
    </div>
  )
}

export default LoginTemplate
