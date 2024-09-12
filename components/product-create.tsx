"use client"

import { SVGProps, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import router, { useRouter } from "next/navigation"

export function ProductCreate() {
  // State to hold the product data
  const [product, setProduct] = useState({
    Name: '',
    Category: 1,
    Price: 0
  });

  // State to manage validation errors
  const [nameError, setNameError] = useState(false)
  const [priceError, setPriceError] = useState(false);
  
  // Router instance for navigation
  const router = useRouter();

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);
  
  // State to manage delete confirmation modal visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle input changes and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "Price" ? parseFloat(value) : value
    }));

    // Validate the Name field
    if (name === "Name") {
      if (value.trim() === "") {
        setNameError(true);
      } else {
        setNameError(false);
      }
    } 
    
    // Validate the Price field
    else if (name === "Price") {
      if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        setPriceError(true);
      } else {
        setPriceError(false);
      }
    }
  };

  // Handle the product creation
  const handleCreate = async () => {
    try {
      const newProduct = {
        Name: product.Name,
        Category: product.Category,
        Price: product.Price,
      };
      
      console.log(JSON.stringify(newProduct))
      
      // POST request to create a new product
      const response = await fetch('https://gendacproficiencytest.azurewebsites.net/api/ProductsAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/json',
        },
        body: JSON.stringify(newProduct),
      });
  
      // Check for errors in the response
      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      // Show the success modal on successful product creation
      setShowModal(true);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  
  // Redirect to home page
  const redirectToHome = () => {
    router.push('/');
  };

  // Success modal component
  const SuccessModal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
          <h2 className="text-lg font-semibold">Product Created</h2>
          <div className="mt-4">
            <p>Your product has successfully been created.</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>OK</Button>
          </div>
        </div>
      </div>
    );
  };

  // Close the success modal and redirect to home page
  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      {/* Header with a back button */}
      <header className="fixed top-0 left-0 w-full px-4 py-3 flex items-center">
        <Button className="flex items-center gap-2" variant="link" onClick={redirectToHome}>
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="text-lg font-semibold text-black">Back</span>
        </Button>
      </header>
      {/* Form card for creating a product */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input for product name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="Name"
              value={product.Name}
              onChange={handleInputChange}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-red-500 text-sm">Name cannot be empty</p>}
          </div>
          {/* Input for product category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="Category"
              type="number"
              min={1}
              max={3}
              value={product.Category}
              onChange={handleInputChange}
            />
          </div>
          {/* Input for product price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="flex items-center">
              <span className="mr-2 text-lg font-semibold">R</span>
              <Input
                id="price"
                name="Price"
                type="number"
                step="0.01"
                min="0.0"
                value={product.Price}
                onChange={handleInputChange}
                className={priceError ? "border-red-500" : ""}
              />
            </div>
            {priceError && <p className="text-red-500 text-sm">Price cannot be empty</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-4">
          {/* Button to submit the product creation form */}
          <Button onClick={handleCreate} className="flex-1">Create</Button>
        </CardFooter>
      </Card>
      {/* Render the success modal if showModal is true */}
      {showModal && <SuccessModal onClose={handleCloseModal} />}
    </div>
  )
}

// Arrow left icon component
function ArrowLeftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
      </svg>
  );
}
