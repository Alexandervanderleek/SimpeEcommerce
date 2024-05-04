import prisma from '@/db/db'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'

const PurchasePage = async ({params:{id}}:{params: {id:string}}) => {
  
 const product = await prisma.product.findUnique({where:{id}})
 if (product==null) return notFound()
  
 return (
    <div>PurchasePage</div>
  )
}

export default PurchasePage