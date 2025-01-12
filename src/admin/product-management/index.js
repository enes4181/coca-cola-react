import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemAvatar, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Edit, RemoveCircle } from '@mui/icons-material';
import { productService } from '../../api/product';
import { productTypeService } from '../../api/product-type';
import { brandService } from '../../api/brand';
import useSnackbar from '../../components/utils/message';
import '../../index.css'; // index.css dosyasını import edin

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [productTypeId, setProductTypeId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { errorMessage, successMessage, SnackbarComponent } = useSnackbar();

  const API_URL = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem('userToken');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      errorMessage(error.message || 'Error fetching products');
      setProducts([]);
    }
  }, [errorMessage]);

  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await productTypeService.getAllProductTypes();
      setProductTypes(response?.data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
      errorMessage(error.message || 'Error fetching product types');
      setProductTypes([]);
    }
  }, [errorMessage]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await brandService.getAllBrands();
      setBrands(response?.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      errorMessage(error.message || 'Error fetching brands');
      setBrands([]);
    }
  }, [errorMessage]);

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchBrands();
  }, [fetchProducts, fetchProductTypes, fetchBrands]);

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('productTypeId', productTypeId);
      formData.append('brandId', brandId);
      existingImages.forEach((image) => {
        formData.append('existingImages', image);
      });
      images.forEach((image) => {
        formData.append('images', image);
      });
      deletedImages.forEach((image) => {
        formData.append('deletedImages', image);
      });

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData, { token });
        setEditingProduct(null);
        successMessage('Product updated successfully');
      } else {
        await productService.addProduct(formData, { token });
        successMessage('Product added successfully');
      }
      setName('');
      setDescription('');
      setPrice('');
      setProductTypeId('');
      setBrandId('');
      setImages([]);
      setExistingImages([]);
      setDeletedImages([]);
      fetchProducts();
    } catch (error) {
      console.error('Error adding/updating product:', error);
      errorMessage(error.message || 'Error adding/updating product');
    }
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setProductTypeId(product.productTypeId);
    setBrandId(product.brandId);
    setImages([]);
    setExistingImages(product.images || []);
    setDeletedImages([]);
    setEditingProduct(product);
  };

  const handleDeleteProduct = async () => {
    try {
      await productService.deleteProduct(productToDelete._id, { token });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
      successMessage('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      errorMessage(error.message || 'Error deleting product');
    }
  };

  const handleCancelEdit = () => {
    setName('');
    setDescription('');
    setPrice('');
    setProductTypeId('');
    setBrandId('');
    setImages([]);
    setExistingImages([]);
    setDeletedImages([]);
    setEditingProduct(null);
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setDeletedImages([...deletedImages, imageToRemove]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const columns = [
    { field: 'name', headerName: 'Product Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'productTypeName', headerName: 'Product Type', flex: 1 },
    { field: 'brandName', headerName: 'Brand', flex: 1 },
    {
      field: 'images',
      headerName: 'Images',
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.row.images.map((image, index) => (
            <img key={index} src={`${API_URL}uploads/${image}`} alt="product" style={{ width: 50, height: 50, marginRight: 5 }} />
          ))}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditProduct(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => openDeleteDialog(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="md" style={{ marginTop: '20px', fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <h1 style={{ fontFamily: 'TCCC-UnityHeadline-Bold, serif' }}>Product Management</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Product Name"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Description"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Price"
              value={price || ''}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>Product Type</InputLabel>
              <Select
                value={productTypeId || ''}
                onChange={(e) => setProductTypeId(e.target.value)}
                label="Product Type"
                style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
              >
                {productTypes.map((productType) => (
                  <MenuItem key={productType._id} value={productType._id} style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
                    {productType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>Brand</InputLabel>
              <Select
                value={brandId || ''}
                onChange={(e) => setBrandId(e.target.value)}
                label="Brand"
                style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id} style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" fullWidth size="small" style={{ fontFamily: 'TCCC-UnityText-Bold, sans-serif' }}>
                Upload Images
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" color="primary" onClick={handleAddProduct} fullWidth size="small" style={{ fontFamily: 'TCCC-UnityText-Bold, sans-serif' }}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
            {editingProduct && (
              <Button variant="contained" color="secondary" onClick={handleCancelEdit} fullWidth size="small" style={{ marginTop: '10px', fontFamily: 'TCCC-UnityText-Bold, sans-serif' }}>
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
        <div style={{ marginTop: '20px' }}>
          <List>
            {existingImages.map((image, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar
                    src={`${API_URL}uploads/${image}`}
                    alt={image}
                  />
                </ListItemAvatar>
                <ListItemText primary={image} style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveExistingImage(index)}>
                    <RemoveCircle />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {images.map((image, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                  />
                </ListItemAvatar>
                <ListItemText primary={image.name} style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveNewImage(index)}>
                    <RemoveCircle />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid rows={products} columns={columns} pageSize={5} rowsPerPageOptions={[5]} getRowId={(row) => row._id} />
        </div>
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle style={{ fontFamily: 'TCCC-UnityHeadline-Bold, serif' }}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            Are you sure you want to delete the product "{productToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary" style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            No
          </Button>
          <Button onClick={handleDeleteProduct} color="primary" autoFocus style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {SnackbarComponent}
    </Container>
  );
};

export default ProductManagement;