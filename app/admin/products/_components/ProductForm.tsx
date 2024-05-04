"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formaters'
import React, { useState } from 'react'
import { addProduct, editProduct } from '../../_actions/products'
import { useFormState, useFormStatus } from 'react-dom'
import { Product } from '@prisma/client'
import Image from 'next/image'

const ProductForm = ({product}:{product?:Product|null}) => {
  
   const [errorStatusForm, action] = useFormState(product == null ? addProduct:editProduct.bind(null, product.id), {})
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)
  
    console.log(product?.imagePath)

  return (
    <form action={action} className='space-y-8'>
        <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input type='text' id="name" name='name' defaultValue={product?.name || ""}></Input>
            {errorStatusForm.name && (<div className='text-destructive'>{errorStatusForm.name}</div>)}
        </div>
        <div className='space-y-2'>
            <Label htmlFor='priceInCents'>Price in cents</Label>
            <Input type='number' id="priceInCents" name='priceInCents' value={priceInCents} onChange={(e)=>{setPriceInCents(Number(e.target.value)||undefined)}}></Input>
            <div className='text-muted-foreground'>{formatCurrency((priceInCents||0)/100)}</div>
            {errorStatusForm.priceInCents && (<div className='text-destructive'>{errorStatusForm.priceInCents}</div>)}
        </div>
        <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea defaultValue={product?.description || ""} id="description" name='description'></Textarea>
            {errorStatusForm.description && (<div className='text-destructive'>{errorStatusForm.description}</div>)}
        </div>
        <div className='space-y-2'>
            <Label htmlFor='file'>File</Label>
            <Input type='file' id="file" name='file' required={product==null}></Input>
            {product != null && (
                <div className='text-muted-foreground'>
                    {product.filePath}
                </div>
            )}
            {errorStatusForm.file && (<div className='text-destructive'>{errorStatusForm.file}</div>)}
        </div>
        <div className='space-y-2'>
            <Label htmlFor='image'>Image</Label>
            <Input type='file' id="image" name='image' required={product==null}></Input>
            {product != null && (
                <Image src={product.imagePath} width={400} height={400} alt="Product Image">
                    
                </Image>

            )}
            {errorStatusForm.image && (<div className='text-destructive'>{errorStatusForm.image}</div>)}
        </div>
        <SubmitButton/>
    </form>
  )
}


function SubmitButton(){
    const {pending} = useFormStatus()
    return(
        <Button type="submit" disabled={pending}>{pending ? "Saving...":"Save"}</Button>
    )
}

export default ProductForm