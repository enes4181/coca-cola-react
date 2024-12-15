import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { brandService } from '../../api/brand';
import useSnackbar from '../../components/utils/message';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const { errorMessage, successMessage, SnackbarComponent } = useSnackbar();
  const token = sessionStorage.getItem('userToken');

  const fetchBrands = useCallback(async () => {
    try {
      const response = await brandService.getAllBrands({ token });
      if (response.success) {
        setBrands(response.data);
      } else {
        throw new Error(response.message || 'Error fetching brands');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      errorMessage(error.message || 'Error fetching brands');
      setBrands([]);
    }
  }, [token, errorMessage]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleAddBrand = async () => {
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, { name }, { token });
        setEditingBrand(null);
        successMessage('Brand updated successfully');
      } else {
        await brandService.addBrand({ name }, { token });
        successMessage('Brand added successfully');
      }
      setName('');
      fetchBrands();
    } catch (error) {
      console.error('Error adding/updating brand:', error);
      errorMessage(error.message || 'Error adding/updating brand');
    }
  };

  const handleEditBrand = (brand) => {
    setName(brand.name);
    setEditingBrand(brand);
  };

  const handleDeleteBrand = async () => {
    try {
      await brandService.deleteBrand(brandToDelete._id, { token });
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
      fetchBrands();
      successMessage('Brand deleted successfully');
    } catch (error) {
      console.error('Error deleting brand:', error);
      errorMessage(error.message || 'Error deleting brand');
    }
  };

  const handleCancelEdit = () => {
    setName('');
    setEditingBrand(null);
  };

  const openDeleteDialog = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const columns = [
    { field: 'name', headerName: 'Brand Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150, // Sütunun genişliğini belirli bir piksel değeri ile ayarladık
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditBrand(params.row)}>
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
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <h1>Brand Management</h1>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Brand Name"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" onClick={handleAddBrand} fullWidth>
              {editingBrand ? 'Update Brand' : 'Add Brand'}
            </Button>
            {editingBrand && (
              <Button variant="contained" color="secondary" onClick={handleCancelEdit} fullWidth style={{ marginTop: '10px' }}>
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid rows={brands} columns={columns} pageSize={5} rowsPerPageOptions={[5]} getRowId={(row) => row._id} />
        </div>
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Delete Brand</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the brand "{brandToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteBrand} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {SnackbarComponent}
    </Container>
  );
};

export default BrandManagement;