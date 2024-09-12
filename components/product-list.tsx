"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation';

// Type definition for a product
type Product = {
  Id: number
  Name: string
  Category: number
  Price: number
}

// Type definition for sort order options
type SortOrder = 'price_asc' | 'price_desc' | 'id'

export const ProductList: React.FC = () => {
  // State hooks for products, loading state, error handling, sort order, and current page
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'id'>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Number of items per page
  const router = useRouter();

  // Effect hook to fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://gendacproficiencytest.azurewebsites.net/api/ProductsAPI');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized value for total number of pages
  const totalPages = useMemo(() => Math.ceil(products.length / itemsPerPage), [products.length, itemsPerPage]);

  // Memoized value for sorted products based on the selected sort order
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOrder) {
      case 'price_asc':
        sorted.sort((a, b) => a.Price - b.Price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.Price - a.Price);
        break;
      default:
        sorted.sort((a, b) => a.Id - b.Id)
    }
    return sorted;
  }, [products, sortOrder]);

  // Memoized value for products displayed on the current page
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedProducts, itemsPerPage]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Handle case where there are no products
  if (products.length === 0) {
    return <div>No products available</div>;
  }

  // Function to go to the next page
  const goToNextPage = () => setCurrentPage((page: number) => Math.min(page + 1, totalPages))

  // Function to go to the previous page
  const goToPrevPage = () => setCurrentPage((page: number) => Math.max(page - 1, 1))

  // Function to handle row click, redirecting to the product detail page
  const handleRowClick = (id: number | string) => {
    router.push(`/pages/view-product?id=${id}`);
  };

  // Function to redirect to the create product page
  const redirectToCreateProduct = () => {
    router.push('/pages/create-product');
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 text-black">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          {/* Sort order selection dropdown */}
          <Select onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Sort by ID</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          {/* Button to create a new product */}
          <Button
            variant="outline"
            size="sm"
            onClick={redirectToCreateProduct}
            className="bg-blue-50 border-2 border-black"
          >
            Create Product
          </Button>
        </div>
        {/* Table displaying products */}
        <div className="rounded-md border border-neutral-200 border-blue-200 overflow-hidden dark:border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Product</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product, index) => {
                // Ensure the key is a string or number
                const key = typeof product.Id === 'string' || typeof product.Id === 'number' ? product.Id : index;

                return (
                  <TableRow key={key} className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"} cursor-pointer`} onClick={() => handleRowClick(product.Id)}>
                    <TableCell>{product.Id}</TableCell>
                    <TableCell>{product.Name}</TableCell>
                    <TableCell>{product.Category}</TableCell>
                    <TableCell>R {product.Price.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span>Page {currentPage}/{totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
