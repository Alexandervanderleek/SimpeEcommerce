import React from "react";
import PageHeader from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/db/db";
import { CheckCircle2, MoreVertical, XCircleIcon } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formaters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropDownItem } from "./_components/ProductActions";

const ProductsAdminPage = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
};

async function ProductsTable() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { order: true } },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) {
    return <p>No Products</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Available For Purchase</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.isAvailableForPurchase ? (
                  <>
                    <CheckCircle2></CheckCircle2>
                    <span className="sr-only">Available</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="stroke-destructive"></XCircleIcon>
                    <span className="sr-only">Unavailable</span>
                  </>
                )}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{formatCurrency(item.priceInCents/100)}</TableCell>
              <TableCell>{formatNumber(item._count.order)}</TableCell>
              <TableCell>
                
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical></MoreVertical>
  
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a download href={`/admin/products/${item.id}`}>Download</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${item.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator></DropdownMenuSeparator>

                    <ActiveToggleDropdownItem id={item.id} isAvail={item.isAvailableForPurchase}>

                    </ActiveToggleDropdownItem>
                    <DeleteDropDownItem id={item.id} disabled={item._count.order>0}></DeleteDropDownItem>

                  </DropdownMenuContent>
                </DropdownMenu>
                
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ProductsAdminPage;
