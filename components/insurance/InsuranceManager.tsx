'use client'

import { useState, useEffect } from 'react'
import { QRCode } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RefreshCwIcon as ReloadIcon } from 'lucide-react'

export default function InsuranceManager() {
  const [insuranceActive, setInsuranceActive] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [coverageDetails, setCoverageDetails] = useState(null)
  const [claimHistory, setClaimHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [claimAmount, setClaimAmount] = useState('')
  const [claimReason, setClaimReason] = useState('')

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/insurance-data')
        if (!response.ok) {
          throw new Error('Failed to fetch insurance data')
        }
        const data = await response.json()
        setInsuranceActive(data.active)
        setCoverageDetails(data.coverageDetails)
        setClaimHistory(data.claimHistory)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch insurance data:', error)
        setError('Failed to fetch insurance data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchInsuranceData()
  }, [])

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true)
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 10000 }), // ₦10,000 for annual coverage
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      setInsuranceActive(true)
      // Fetch updated insurance data after successful payment
      await fetchInsuranceData()
    } catch (error) {
      console.error('Payment failed:', error)
      setError('Payment processing failed. Please try again later.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const handleFileClaim = async () => {
    try {
      const response = await fetch('/api/file-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: claimAmount, reason: claimReason }),
      })

      if (!response.ok) {
        throw new Error('Failed to file claim')
      }

      alert('Claim filed successfully!')
      setClaimAmount('')
      setClaimReason('')
      // Fetch updated claim history after successful filing
      await fetchInsuranceData()
    } catch (error) {
      console.error('Failed to file claim:', error)
      setError('Failed to file claim. Please try again later.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading insurance data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Insurance Status</h3>
        <p className="mb-4">
          Status: <span className={insuranceActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {insuranceActive ? "Active" : "Inactive"}
          </span>
        </p>
        {coverageDetails && (
          <div className="mb-4">
            <h4 className="font-semibold">Coverage Details:</h4>
            <p>Policy Number: {coverageDetails.policyNumber}</p>
            <p>Coverage Amount: {coverageDetails.coverageAmount}</p>
            <p>Start Date: {coverageDetails.startDate}</p>
            <p>End Date: {coverageDetails.endDate}</p>
          </div>
        )}
        {!insuranceActive && (
          <Button
            onClick={handlePayment}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay ₦10,000 for Annual Coverage'
            )}
          </Button>
        )}
        {insuranceActive && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>File a Claim</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File a Claim</DialogTitle>
                <DialogDescription>
                  Enter the details of your claim below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="claimAmount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="claimAmount"
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="claimReason" className="text-right">
                    Reason
                  </Label>
                  <Input
                    id="claimReason"
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleFileClaim}>Submit Claim</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Authentication QR Code</h3>
        {coverageDetails && coverageDetails.policyNumber ? (
          <div className="flex justify-center">
            <QRCode value={`https://example.com/verify-insurance/${coverageDetails.policyNumber}`} size={200} />
          </div>
        ) : (
          <p>Unable to generate QR code. Policy number not available.</p>
        )}
      </div>
      {claimHistory.length > 0 && (
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Claim History</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
                <th className="text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {claimHistory.map(claim => (
                <tr key={claim.id}>
                  <td>{claim.date}</td>
                  <td>{claim.amount}</td>
                  <td>{claim.status}</td>
                  <td>{claim.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

