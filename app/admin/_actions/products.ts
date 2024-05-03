"use server"

import prisma from '@/db/db'
import {z} from 'zod'
import fs from 'fs/promises'
import { redirect } from 'next/navigation'

const fileSchema = z.instanceof(File)

const imageSchema = fileSchema.refine(file => file.size===0 || file.type.startsWith("image/"))

const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file=>file.size>0,"Required"),
    image: imageSchema.refine(file=>file.size>0,"Required"),
})

export async function addProduct(formData: FormData){
    

    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        console.log(result.error.formErrors.fieldErrors)
        return result.error.formErrors.fieldErrors
    }

    const data = result.data

    try{
    await fs.mkdir("products", {recursive:true})
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive:true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    prisma.product.create({data:{
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath
    }}).catch(e=>console.log(e)).then((e)=>{console.log(e)})
    }catch(e){
        console.log(e)
    }

    redirect('/admin/products')
}