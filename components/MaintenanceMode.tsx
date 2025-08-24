'use client'

import { Settings, AlertTriangle } from 'lucide-react'

interface MaintenanceModeProps {
  message?: string
}

export const MaintenanceMode = ({ 
  message = "現在メンテナンス中です。しばらくお待ちください。" 
}: MaintenanceModeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Settings className="h-16 w-16 text-blue-600 animate-spin" style={{
              animation: 'spin 3s linear infinite'
            }} />
            <AlertTriangle className="h-6 w-6 text-orange-500 absolute -top-1 -right-1" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          メンテナンス中
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ご不便をおかけして申し訳ございません。<br />
            復旧まで今しばらくお待ちください。
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{
              animationDelay: '0.2s'
            }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{
              animationDelay: '0.4s'
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}