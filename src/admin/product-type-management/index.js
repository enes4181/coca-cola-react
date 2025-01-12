import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { productTypeService } from "../../api/product-type";
import useSnackbar from "../../components/utils/message";
import '../../index.css'; // index.css dosyasını import edin

const ProductTypeManagement = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [name, setName] = useState("");
  const [editingProductType, setEditingProductType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState(null);
  const { errorMessage, successMessage, SnackbarComponent } = useSnackbar();

  const token = sessionStorage.getItem('userToken');

  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await productTypeService.getAllProductTypes();
      setProductTypes(response?.data || []);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
      errorMessage(error.message || "Error fetching product types");
    }
  }, [ errorMessage]);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  const handleAddProductType = async () => {
    try {
      if (editingProductType) {
        await productTypeService.updateProductType(
          editingProductType._id,
          { name },
          { token }
        );
        setEditingProductType(null);
        successMessage("Product Type updated successfully");
      } else {
        await productTypeService.addProductType({ name }, { token });
        successMessage("Product Type added successfully");
      }
      setName("");
      fetchProductTypes();
    } catch (error) {
      console.error("Error adding/updating product type:", error);
      errorMessage(error.message || "Error adding/updating product type");
    }
  };

  const handleEditProductType = (productType) => {
    setName(productType.name);
    setEditingProductType(productType);
  };

  const handleDeleteProductType = async () => {
    try {
      await productTypeService.deleteProductType(productTypeToDelete._id, {
        token,
      });
      setDeleteDialogOpen(false);
      setProductTypeToDelete(null);
      fetchProductTypes();
      successMessage("Product Type deleted successfully");
    } catch (error) {
      console.error("Error deleting product type:", error);
      errorMessage(error.message || "Error deleting product type");
    }
  };

  const handleCancelEdit = () => {
    setName("");
    setEditingProductType(null);
  };

  const openDeleteDialog = (productType) => {
    setProductTypeToDelete(productType);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductTypeToDelete(null);
  };

  const columns = [
    { field: "name", headerName: "Product Type Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditProductType(params.row)}>
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
    <Container maxWidth="md" style={{ marginTop: "20px", fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <h1 style={{ fontFamily: 'TCCC-UnityHeadline-Bold, serif' }}>Product Type Management</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Product Type Name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProductType}
              fullWidth
              size="small"
              style={{ fontFamily: 'TCCC-UnityText-Bold, sans-serif' }}
            >
              {editingProductType ? "Update Product Type" : "Add Product Type"}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {editingProductType && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancelEdit}
                fullWidth
                size="small"
                style={{ marginTop: "10px", fontFamily: 'TCCC-UnityText-Bold, sans-serif' }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={productTypes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
          />
        </div>
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle style={{ fontFamily: 'TCCC-UnityHeadline-Bold, serif' }}>Delete Product Type</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            Are you sure you want to delete the product type "
            {productTypeToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary" style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            No
          </Button>
          <Button onClick={handleDeleteProductType} color="primary" autoFocus style={{ fontFamily: 'TCCC-UnityText-Regular, sans-serif' }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {SnackbarComponent}
    </Container>
  );
};

export default ProductTypeManagement;