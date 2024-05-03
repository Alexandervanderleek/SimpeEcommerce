"use client"
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React, { startTransition, useTransition } from 'react'
import { deleteProduct, toggleAvail } from '../../_actions/products';
import { useRouter } from 'next/navigation';

export const ActiveToggleDropdownItem = ({
    id,
    isAvail
}:{id:string, isAvail:boolean}) => {
    const router = useRouter()
    const [isPending,startTransition] = useTransition();
    return (
    <DropdownMenuItem disabled={isPending} onClick={()=>{
        startTransition(async()=>{
            await toggleAvail(id, !isAvail)
            router.refresh()
        })
    }}>
        {isAvail ? "Deactivate":"Activate"}
    </DropdownMenuItem>
  )
}

export const DeleteDropDownItem = ({id, disabled}:{id:string, disabled:boolean}) => {
        const router = useRouter()
        const [isPending,startTransition] = useTransition();
        return (
        <DropdownMenuItem variant='destructive' disabled={disabled||isPending} onClick={()=>{
            startTransition(async()=>{
                await deleteProduct(id)
                router.refresh()
            })
        }}>
            Delete
        </DropdownMenuItem>
        ) 
  }

