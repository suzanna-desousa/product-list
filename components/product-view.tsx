"use client"

import { SVGProps, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import router, { useRouter } from "next/navigation"

// Component for viewing and editing a product
export function ProductView() {
  // State to hold product data
  const [product, setProduct] = useState({
    Id: '',
    Name: '',
    Category: 1,
    Price: 0
  });

  // State to manage input validation errors
  const [nameError, setNameError] = useState(false)
  const [priceError, setPriceError] = useState(false);
  
  // Hook to get router instance for navigation
  const router = useRouter();
  
  // State to control the visibility of modals
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Effect to fetch product data when the component mounts
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id');
    if (id) {
      const fetchProduct = async () => {
        const response = await fetch(`https://gendacproficiencytest.azurewebsites.net/api/ProductsAPI/${id}`);
        const data = await response.json();
        setProduct(data);
      };
      fetchProduct();
    }
  }, []);

  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "Price" ? parseFloat(value) : value
    }));

    // Validate the 'Name' input field
    if (name === "Name") {
      if (value.trim() === "") {
        setNameError(true);
      } else {
        setNameError(false);
      }
    } else if (name === "Price") {
      // Validate the 'Price' input field
      if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        setPriceError(true);
      } else {
        setPriceError(false);
      }
    }
  };

  // Save product changes to the API
  const handleSave = async () => {
    let hasError = false;
    console.log(product);
  
    // Validate 'Name' and 'Price'
    if (product.Name.trim() === "") {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }
  
    if (isNaN(product.Price) || product.Price <= 0) {
      setPriceError(true);
      hasError = true;
    } else {
      setPriceError(false);
    }
  
    if (hasError) return;
  
    try {
      const response = await fetch(`https://gendacproficiencytest.azurewebsites.net/api/ProductsAPI/${product.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      console.log("Saving successful, showing modal");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  // Close the success modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Delete the product from the API
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://gendacproficiencytest.azurewebsites.net/api/ProductsAPI/${product.Id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      router.push('/'); // Redirect to home after deletion
      console.log("Product deleted:", product.Id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Redirect to the home page
  const redirectToHome = () => {
    router.push('/');
  };

  // Confirm the deletion of the product
  const handleConfirmDelete = () => {
    handleDelete();
    setShowDeleteConfirm(false);
  };

  // Cancel the deletion process
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Modal component for displaying success message
  const SuccessModal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
          <h2 className="text-lg font-semibold">Changes Saved</h2>
          <div className="mt-4">
            <p>Your changes have been successfully saved.</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>OK</Button>
          </div>
        </div>
      </div>
    );
  };

  // Modal component for confirming product deletion
  const DeleteConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <div className="mt-4">
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="destructive" onClick={onConfirm}>Delete</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <header className="fixed top-0 left-0 w-full px-4 py-3 flex items-center">
        <Button className="flex items-center gap-2" variant="link" onClick={redirectToHome}>
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="text-lg font-semibold text-black">Back</span>
        </Button>
      </header>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>View Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              name="Id"
              value={product.Id}
              disabled
            />
          </div>
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
          <Button onClick={handleSave} className="flex-1">Save Changes</Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="flex-1">Delete Product</Button>
        </CardFooter>
      </Card>
      {showModal && <SuccessModal onClose={handleCloseModal} />}
      {showDeleteConfirm && <DeleteConfirmModal onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
    </div>
  )
}

// Icon component for the "Back" button
function ArrowLeftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  )
}
