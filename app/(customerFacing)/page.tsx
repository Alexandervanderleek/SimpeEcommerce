import { Button } from "@/components/ui/button";
import prisma from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import ProductCard, { ProductCardSkeleton } from "../../components/ProductCard";
import { cache } from "@/lib/cache";

 const getMostPopular = cache(()=> {
    return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { order: { _count: "desc" } },
    take: 6
  });
}, ["/","getMostPopular"], {revalidate:60*60*24})

const getNewest = cache(()=> {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { order: { _count: "desc" } },
      take: 6
    });
  },["/","getNewest"], {revalidate:60*60*24})

const HomePage = () => {
  return (
    <main className="space-y-12">
        <ProductGridSection productFetcher={getMostPopular} title="Popular Products"></ProductGridSection>
        <ProductGridSection productFetcher={getNewest} title="Newest Products"></ProductGridSection>

    </main>
  );
};


type ProductGridSectionProps = {
    productFetcher: ()=>Promise<Product[]>,
    title: string
}

function ProductGridSection({productFetcher, title}:ProductGridSectionProps){

    return(
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">
                    {title}
                </h2>
                <Button variant={"outline"} asChild>
                    <Link href={"/products"} className="space-x-2">
                      <span>View All</span>  
                      <ArrowRight className="size-4"></ArrowRight>
                    </Link>
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Suspense fallback={<>
                    <ProductCardSkeleton></ProductCardSkeleton>
                    <ProductCardSkeleton></ProductCardSkeleton>
                    <ProductCardSkeleton></ProductCardSkeleton>

                </>} >
                    <ProductSuspense productFetcher={productFetcher}></ProductSuspense>
                </Suspense>
                
                
                
            </div>

        </div>
    )
}

async function ProductSuspense({productFetcher}:{ productFetcher: ()=>Promise<Product[]>} ){
    return (await productFetcher()).map(product => (
        <ProductCard key={product.id} {...product}></ProductCard>
    ))
}




export default HomePage;
