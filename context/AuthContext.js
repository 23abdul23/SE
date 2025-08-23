"use client"

import React from 'react';
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth();
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.log("Error loading stored auth:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { token: authToken, user: userData } = response.data

      await AsyncStorage.setItem("authToken", authToken)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))

      setToken(authToken)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      
      const response = await authAPI.register(userData)
      return { success: true, data: response.data }
    } catch (error) {

      console.log(error)
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken")
      await AsyncStorage.removeItem("userData")
      setToken(null)
      setUser(null)
    } catch (error) {
      console.log("Error during logout:", error)
    }
  }

  React.useEffect(() => {
  }, [user, token, loading]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
