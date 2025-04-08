import PricingHead from '@/components/tutorPages/personel_info/Pricing/PricingHead'
import SetPricing from '@/components/tutorPages/personel_info/Pricing/SetPricing'
import React from 'react'
interface MyPageProps {
  params: { uid: string }
}

const pricing = ({ params }: MyPageProps) => {
  return (
    <div className='flex flex-col gap-5 w-full'>
      <PricingHead />
      <SetPricing uid={params.uid} />
    </div>
  )
}

export default pricing
